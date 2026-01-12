using FluentAssertions;
using FluentAssertions.Execution;
using JadeWesserPort.Data;
using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Data.Repositories;
using JWPTests.Providers;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace JWPTests.Repositories;

[TestFixture]
public class DockRecordRepositoryTests
{
    private IDockRecordRepository _dockRecordRepository;
    private JWPDbContext _dbContext;
    private SqliteConnection _sqliteConnection;

    [SetUp]
    public void SetUp()
    {
        _dbContext = JwpInMemoryDbContext.GetSqliteInMemoryContext().Context;
        _sqliteConnection = JwpInMemoryDbContext.GetSqliteInMemoryContext().Connection;
        _dockRecordRepository = new DockRecordRepository(_dbContext);
    }

    [TearDown]
    public async Task TearDown()
    {
        await _dbContext.DisposeAsync();
        _sqliteConnection.Close();
        _sqliteConnection.Dispose();
    }

    [Test]
    public async Task CreateAsync_CorrectDataGiven_ShouldReturnCreatedDockRecordCode()
    {
        // Arrange
        var code = "DCK-001";
        var dockRecord = new DockRecordProvider()
            .WithCode(code)
            .Provide();

        // Act
        var resultCode = await _dockRecordRepository.CreateAsync(dockRecord);

        // Assert
        var resultDockRecord = await _dbContext.DockRecords.FirstOrDefaultAsync(d => d.Code.Equals(code));
        using (new AssertionScope())
        {
            resultCode.Should().Be(code);
            resultDockRecord.Should().BeEquivalentTo(dockRecord);
        }
    }

    [Test]
    public async Task CreateAsync_DuplicateCodeGiven_ShouldThrowException()
    {
        // Arrange
        var code = "DCK-002";
        var dock1 = new DockRecordProvider().WithCode(code).Provide();
        var dock2 = new DockRecordProvider().WithCode(code).Provide();

        await _dockRecordRepository.CreateAsync(dock1);

        // Act + Assert
        Assert.ThrowsAsync<DbUpdateException>(async () => await _dockRecordRepository.CreateAsync(dock2));
    }

    [Test]
    public async Task FindByCodeAsync_ExistingCodeGiven_ShouldReturnDockRecord()
    {
        // Arrange
        var code = "DCK-003";
        var dockRecord = new DockRecordProvider().WithCode(code).Provide();

        await _dbContext.DockRecords.AddAsync(dockRecord);
        await _dbContext.SaveChangesAsync();

        // Act
        var result = await _dockRecordRepository.FindByCodeAsync(code);

        // Assert
        result.Should().BeEquivalentTo(dockRecord);
    }

    [Test]
    public async Task FindByCodeAsync_NonExistentCodeGiven_ShouldReturnNull()
    {
        // Arrange
        var code = "NOPE";
        var dockRecord = new DockRecordProvider().Provide();

        await _dbContext.DockRecords.AddAsync(dockRecord);
        await _dbContext.SaveChangesAsync();

        // Act
        var result = await _dockRecordRepository.FindByCodeAsync(code);

        // Assert
        result.Should().BeNull();
    }

    [Test]
    public async Task GetAllAsync_WhenDockRecordsExist_ShouldReturnAllDockRecords()
    {
        // Arrange
        var dockRecords = new DockRecordProvider().ProvideList();

        await _dbContext.DockRecords.AddRangeAsync(dockRecords);
        await _dbContext.SaveChangesAsync();

        // Act
        var results = await _dockRecordRepository.GetAllAsync();

        // Assert
        results.Should().BeEquivalentTo(dockRecords);
    }
}