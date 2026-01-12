using FluentAssertions;
using JadeWesserPort.Data;
using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Data.Repositories;
using JWPTests.Providers;
using Microsoft.EntityFrameworkCore;

namespace JWPTests.Repositories;

[TestFixture]
public class StorageAreaRepositoryTests
{
    private IStorageAreaRepository _repository;
    private JWPDbContext _dbContext;

    [SetUp]
    public void SetUp()
    {
        _dbContext = JwpInMemoryDbContext.GetContext();
        _repository = new StorageAreaRepository(_dbContext);
    }

    [TearDown]
    public async Task TearDown()
    {
        await _dbContext.DisposeAsync();
    }

    [Test]
    public async Task CreateAsync_ValidStorageArea_ShouldPersistEntity()
    {
        // Arrange
        var storage = new StorageAreaProvider().Provide();

        // Act
        var result = await _repository.CreateAsync(storage);

        // Assert
        result.Should().Be(1);
        var stored = await _dbContext.StorageAreas.FirstOrDefaultAsync(s => s.Code == storage.Code);
        stored.Should().NotBeNull();
        stored!.Type.Should().Be(storage.Type);
        stored.Location.Should().Be(storage.Location);
    }

    [Test]
    public async Task FindByCodeAsync_WhenEntityExists_ShouldReturnStorageArea()
    {
        // Arrange
        var storage = new StorageAreaProvider().Provide();
        await _dbContext.StorageAreas.AddAsync(storage);
        await _dbContext.SaveChangesAsync();

        // Act
        var found = await _repository.FindByCodeAsync(storage.Code);

        // Assert
        found.Should().NotBeNull();
        found!.Code.Should().Be(storage.Code);
        found.MaxCapacity.Should().Be(storage.MaxCapacity);
    }

    [Test]
    public async Task FindByCodeAsync_WhenEntityDoesNotExist_ShouldReturnNull()
    {
        // Act
        var found = await _repository.FindByCodeAsync("INVALID");

        // Assert
        found.Should().BeNull();
    }
}