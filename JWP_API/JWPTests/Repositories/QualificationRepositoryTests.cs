using FluentAssertions;
using FluentAssertions.Execution;
using JadeWesserPort.Data;
using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Data.Repositories;
using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs.QualificationDTOs;
using JWPTests.Providers; // Assuming you have a QualificationProvider here
using Microsoft.EntityFrameworkCore;

namespace JWPTests.Repositories;

[TestFixture]
public class QualificationRepositoryTests
{
    private IQualificationRepository _qualificationRepository;
    private JWPDbContext _dbContext;

    [SetUp]
    public void SetUp()
    {
        // Assumes JwpInMemoryDbContext.GetContext() sets up the in-memory database
        // as seen in your example.
        _dbContext = JwpInMemoryDbContext.GetContext(); 
        _qualificationRepository = new QualificationRepository(_dbContext);
    }

    [TearDown]
    public async Task TearDown()
    {
        await _dbContext.DisposeAsync();
    }

    [Test]
    // MethodName_StateUnderTest_ExpectedBehavior
    public async Task CreateAsync_CorrectDataGiven_ReturnsCreatedQualificationId()
    {
        // Arrange
        var code = "TST001";
        var qualification = new QualificationProvider() // Assuming you have a provider
            .WithCode(code)
            .Provide();
        
        // Act
        var resultCode = await _qualificationRepository.CreateAsync(qualification);

        // Assert
        var isResultInDb =
            await _qualificationRepository.ExistsByCodeAsync(code);
        
        using (new AssertionScope())
        {
            resultCode.Should().Be(code);
            isResultInDb.Should().BeTrue();
        }
    }

    [Test]
    public async Task CreateAsync_DuplicateIdGiven_ShouldThrowInvalidOperationException()
    {
        // Arrange
        var id = Guid.NewGuid();
        var q1 = new QualificationProvider().WithId(id).Provide();
        var q2 = new QualificationProvider().WithId(id).Provide();

        await _dbContext.Qualifications.AddAsync(q1);
        await _dbContext.SaveChangesAsync();

        // Act & Assert
        await _qualificationRepository.Awaiting(q => q.CreateAsync(q2))
            .Should().ThrowAsync<InvalidOperationException>("because the DbContext is already tracking an entity with this key.");
    }

    [Test]
    public async Task GetAllAsync_WhenQualificationsExist_ShouldReturnListOfQualifications()
    {
        // Arrange
        var qualifications = new QualificationProvider().ProvideList(); 

        await _dbContext.Qualifications.AddRangeAsync(qualifications);
        await _dbContext.SaveChangesAsync();
        
        // Act
        var results = await _qualificationRepository.GetAllAsync();
        
        // Assert
        results.Should().NotBeNull();
        results.Should().BeEquivalentTo(qualifications);
        results.Count.Should().Be(3);
    }
    
    [Test]
    public async Task GetAllAsync_WhenNoQualificationsExist_ShouldReturnEmptyList()
    {
        // Arrange
        // No qualifications added
        
        // Act
        var results = await _qualificationRepository.GetAllAsync();
        
        // Assert
        results.Should().NotBeNull();
        results.Should().BeEmpty();
    }

    [Test]
    public async Task UpdateAsync_ExistingIdGiven_ShouldReturnTrueAndUdpateQualification()
    {
        // Arrange
        var code = "UPD001";
        var qualification = new QualificationProvider()
            .WithCode(code)
            .Provide();

        await _dbContext.Qualifications.AddAsync(qualification);
        await _dbContext.SaveChangesAsync();
        
        // Detach the entity so the context can track the update
        _dbContext.Entry(qualification).State = EntityState.Detached;

        var qualificationDto = new UpdateQualificationDTO()
        {
            Name = "New Updated Name"
        };
        
        // Act
        var result = await _qualificationRepository.UpdateAsync(code, qualificationDto);
        
        // Assert
        var updatedInDb = await _dbContext.Qualifications.FindAsync(qualification.Id);

        using (new AssertionScope())
        {
            result.Should().BeTrue();
            updatedInDb.Should().NotBeNull();
            updatedInDb.Name.Should().Be(qualificationDto.Name);
            // The repository method updates this timestamp
            updatedInDb.UpdatedAt.Should().BeCloseTo(DateTime.Now, TimeSpan.FromSeconds(2));
        }
    }

    [Test]
    public async Task UpdateAsync_NonExistentIdGiven_ShouldReturnFalse()
    {
        // Arrange
        var code = "TST003";
        var qualificationDto = new UpdateQualificationDTO()
        {
            Name = "New Updated Name"
        };
        
        // Act
        var result = await _qualificationRepository.UpdateAsync(code, qualificationDto);
        
        // Assert
        result.Should().BeFalse();
    }

    [Test]
    public async Task GetAllQueryable_WhenCalled_ShouldReturnQueryableCollection()
    {
        // Arrange
        var qualifications = new QualificationProvider().ProvideList();
        
        await _dbContext.Qualifications.AddRangeAsync(qualifications);
        await _dbContext.SaveChangesAsync();
        
        var expectedQualification = qualifications.First();

        // Act
        var queryable = _qualificationRepository.GetAllQueryable();
        var result = await queryable.FirstOrDefaultAsync(q => q.Id == expectedQualification.Id);

        // Assert
        using (new AssertionScope())
        {
            queryable.Should().NotBeNull();
            queryable.Should().BeAssignableTo<IQueryable<Qualification>>();
            result.Should().BeEquivalentTo(expectedQualification);
        }
    }
    
    [Test]
    public async Task CreateAsync_DuplicateCodeGiven_ShouldThrowInvalidOperationException()
    {
        // Arrange
        var q1 = new QualificationProvider()
            .WithCode("PL01")
            .Provide();

        var q2 = new QualificationProvider()
            .WithCode("PL01") // duplicate code
            .Provide();

        await _dbContext.Qualifications.AddAsync(q1);
        await _dbContext.SaveChangesAsync();

        // Act & Assert
        await _qualificationRepository
            .Awaiting(repo => repo.CreateAsync(q2))
            .Should()
            .ThrowAsync<InvalidOperationException>()
            .WithMessage("A qualification with code 'PL01' already exists.");
    }

}