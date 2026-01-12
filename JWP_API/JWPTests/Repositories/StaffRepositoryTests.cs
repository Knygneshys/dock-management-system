using FluentAssertions;
using FluentAssertions.Execution;
using JadeWesserPort.Data;
using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Data.Repositories;
using JWPTests.Providers;
using Microsoft.EntityFrameworkCore;

namespace JWPTests.Repositories;

[TestFixture]
public class StaffRepositoryTests
{
    private IStaffRepository _staffRepository;
    private JWPDbContext _dbContext;

    [SetUp]
    public void SetUp()
    {
        // Setup an in-memory database context for isolation
        _dbContext = JwpInMemoryDbContext.GetContext();
        _staffRepository = new StaffRepository(_dbContext);
    }

    [TearDown]
    public async Task TearDown()
    {
        // Dispose the context to ensure isolation for the next test
        await _dbContext.DisposeAsync();
    }

    [Test]
    public async Task CreateAsync_CorrectDataGiven_ShouldReturnCreatedStaffId()
    {
        // Arrange
        var staffNumber = 432432;
        var staff = new StaffMemberProvider()
            .WithMecanographicNumber(staffNumber)
            .Provide();

        // Act
        var resultId = await _staffRepository.CreateAsync(staff);

        // Assert
        var resultStaff = await _dbContext.StaffMembers.FirstOrDefaultAsync(s => s.MecanographicNumber.Equals(staffNumber));
        using (new AssertionScope())
        {
            resultId.Should().Be(staffNumber, "because the repository should return the number of the created entity.");
            resultStaff.Should().NotBeNull("because the staff member should exist in the database after creation.");
            // Excluding Id since the database may store the entity differently (e.g., identity properties) 
            // but the data fields should match.
            resultStaff.Should().BeEquivalentTo(staff, options => options.Excluding(s => s.Id), "because the stored data must match the input data.");
        }
    }

    [Test]
    public async Task CreateAsync_DuplicateIdGiven_ShouldThrowException()
    {
        // Arrange
        var staffId = Guid.NewGuid();
        var staff1 = new StaffMemberProvider().WithId(staffId).Provide();
        var staff2 = new StaffMemberProvider().WithId(staffId).Provide();

        await _dbContext.StaffMembers.AddAsync(staff1);
        await _dbContext.SaveChangesAsync();
    
        // Clear tracker para evitar conflito no contexto
        _dbContext.ChangeTracker.Clear();

        // Act + Assert
        await _staffRepository.Awaiting(s => s.CreateAsync(staff2))
            .Should().ThrowAsync<Exception>("because creating an entity with an existing primary key should fail.");
    }

    [Test]
    public async Task GetAllAsync_MethodCalled_ShouldReturnListOfStaffMembers()
    {
        // Arrange
        var staffMembers = new StaffMemberProvider().ProvideList();
        await _dbContext.StaffMembers.AddRangeAsync(staffMembers);
        await _dbContext.SaveChangesAsync();

        // Act
        var results = await _staffRepository.GetAllAsync();

        // Assert
        results.Should().BeEquivalentTo(staffMembers, "because the repository should return all entities stored.");
    }
    
    // The FindByIdAsync and GetBySearchAsync tests have been removed as per the user request.

    [Test]
    public async Task UpdateAsync_ExistingIdGiven_ShouldUpdateStaffMember()
    {
        // Arrange
        var staffId = Guid.NewGuid();
        const string updatedEmail = "new.email@example.com";
        
        // Initial entity setup
        var staff = new StaffMemberProvider().WithId(staffId).Provide();
        await _dbContext.StaffMembers.AddAsync(staff);
        await _dbContext.SaveChangesAsync();

        // DTO with the updated value
        staff.Email = updatedEmail;

        // Act
        await _staffRepository.SaveChangesAsync();

        // Assert
        var updatedStaff = await _dbContext.StaffMembers.FirstOrDefaultAsync(s => s.Id.Equals(staffId));
        using (new AssertionScope())
        {
            updatedStaff.Should().NotBeNull();
            updatedStaff!.Email.Should().Be(updatedEmail, "because the email property should have been updated.");
        }
    }
}
