using FluentAssertions;
using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Services;
using JWPTests.Providers;
using Mapster;
using MapsterMapper;
using Moq;
using Microsoft.EntityFrameworkCore;
using JadeWesserPort.Data;
using JadeWesserPort.DTOs.QualificationDTOs;
using JadeWesserPort.Domain.Entities;

namespace JWPTests.Services;

[TestFixture]
public class QualificationServiceTests
{
    private QualificationService _qualificationService;
    private Mock<IQualificationRepository> _mockRepo;
    private IMapper _mapper;

    // Helper method to create a list of qualifications that can be queried asynchronously
    private IQueryable<Qualification> CreateAsyncQueryable(List<Qualification> qualifications)
    {
        var options = new DbContextOptionsBuilder<JWPDbContext>()
            .UseInMemoryDatabase(databaseName: System.Guid.NewGuid().ToString()) // Unique DB for each test
            .Options;

        var context = new JWPDbContext(options);
        context.Qualifications.AddRange(qualifications);
        context.SaveChanges();
        return context.Qualifications;
    }

    [SetUp]
    public void SetUp()
    {
        _mockRepo = new Mock<IQualificationRepository>();
        
        var config = new TypeAdapterConfig();
        config.NewConfig<Qualification, QualificationDTO>();
        _mapper = new Mapper(config); 
        
        _qualificationService = new QualificationService(_mockRepo.Object, _mapper);
    }
    
    // --- GetBySearchAsync Tests ---

    [Test]
    public async Task GetBySearchAsync_NoFiltersGiven_ShouldReturnAllQualifications()
    {
        // Arrange
        var domainList = new QualificationProvider().ProvideList();
        var asyncQueryable = CreateAsyncQueryable(domainList);
        var expectedDtoList = _mapper.Map<IEnumerable<QualificationDTO>>(domainList);
        
        _mockRepo.Setup(r => r.GetAllQueryable())
            .Returns(asyncQueryable);

        // Act
        var result = await _qualificationService.GetBySearchAsync(null, null, null);

        // Assert
        result.Should().BeEquivalentTo(expectedDtoList, "because with no filters, all items should be returned.");
        _mockRepo.Verify(r => r.GetAllQueryable(), Times.Once);
    }

    [Test]
    public async Task GetBySearchAsync_FilterByNameWithEquals_ShouldReturnExactMatch()
    {
        // Arrange
        const string targetName = "Pilot License";
        var matchingDomain = new QualificationProvider().WithName(targetName).Provide();
        var nonMatchingDomain = new QualificationProvider().WithName("Different Name").Provide();
        var data = new List<Qualification> { matchingDomain, nonMatchingDomain };
        
        _mockRepo.Setup(r => r.GetAllQueryable())
            .Returns(CreateAsyncQueryable(data));

        // Act
        var result = await _qualificationService.GetBySearchAsync(targetName, null, "equals");

        // Assert
        result.Should().ContainSingle(q => q.Name == targetName, "because only the exact match should be returned.");
    }
    
    [Test]
    public async Task GetBySearchAsync_FilterByCodeWithContains_ShouldReturnPartialMatches()
    {
        // Arrange
        const string searchCode = "01";
        var q1 = new QualificationProvider().WithCode("PL-01-A").Provide(); // Match
        var q2 = new QualificationProvider().WithCode("MC-02-B").Provide(); // No Match
        var q3 = new QualificationProvider().WithCode("QW-01-C").Provide(); // Match
        var data = new List<Qualification> { q1, q2, q3 };

        _mockRepo.Setup(r => r.GetAllQueryable())
            .Returns(CreateAsyncQueryable(data));

        // Act
        var result = await _qualificationService.GetBySearchAsync(null, searchCode, "contains");

        // Assert
        result.Should().HaveCount(2, "because two qualifications contain '01' in their code.");
        result.Should().OnlyContain(q => q.Code.Contains(searchCode));
    }
    
    [Test]
    public async Task GetBySearchAsync_OperatorIsNull_ShouldDefaultToContainsAndReturnMatch()
    {
        // Arrange
        const string partialName = "Pilot";
        var q1 = new QualificationProvider().WithName("Chief Pilot").Provide(); // Match
        var q2 = new QualificationProvider().WithName("Crane Operator").Provide(); // No Match
        var data = new List<Qualification> { q1, q2 };

        _mockRepo.Setup(r => r.GetAllQueryable())
            .Returns(CreateAsyncQueryable(data));

        // Act
        var result = await _qualificationService.GetBySearchAsync(partialName, null, null);

        // Assert
        result.Should().ContainSingle(q => q.Name.Contains(partialName), "because operatorType should default to 'contains'.");
    }

    [Test]
    public async Task GetBySearchAsync_CombinedNameAndCodeFilter_ShouldReturnSpecificMatch()
    {
        // Arrange
        var q1 = new QualificationProvider().WithName("Advanced Crane Operator").WithCode("CRANE-ADV").Provide(); // Match
        var q2 = new QualificationProvider().WithName("Advanced Crane Operator").WithCode("CRANE-BSC").Provide(); // No Match
        var q3 = new QualificationProvider().WithName("Basic Crane Operator").WithCode("CRANE-ADV").Provide(); // No Match
        var data = new List<Qualification> { q1, q2, q3 };
        
        _mockRepo.Setup(r => r.GetAllQueryable())
            .Returns(CreateAsyncQueryable(data));

        // Act
        var result = await _qualificationService.GetBySearchAsync("Advanced", "ADV", "contains");

        // Assert
        result.Should().ContainSingle()
            .Which.Name.Should().Be("Advanced Crane Operator");
    }

    [Test]
    public async Task GetBySearchAsync_NoMatchesFound_ShouldReturnEmptyList()
    {
        // Arrange
        const string searchName = "NonExistentName";
        var domainList = new QualificationProvider().ProvideList();
        
        _mockRepo.Setup(r => r.GetAllQueryable())
            .Returns(CreateAsyncQueryable(domainList));

        // Act
        var result = await _qualificationService.GetBySearchAsync(searchName, null, "equals");

        // Assert
        result.Should().BeEmpty("because no qualification has that exact name.");
    }
}

