using FluentAssertions;
using JadeWesserPort.Data;
using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Data.Repositories;
using JadeWesserPort.Domain.Enums;
using JadeWesserPort.DTOs.ResourceDTOs;
using JWPTests.Providers;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace JWPTests.Repositories;

[TestFixture]
internal class ResourceRepositoryTests
{
    private IResourceRepository _resourceRepository;
    private JWPDbContext _dbContext;
    private SqliteConnection _sqliteConnection;

    [SetUp]
    public void SetUp()
    {
        _dbContext = JwpInMemoryDbContext.GetSqliteInMemoryContext().Context;
        _sqliteConnection = JwpInMemoryDbContext.GetSqliteInMemoryContext().Connection;
        _resourceRepository = new ResourceRepository(_dbContext);
    }

    [TearDown]
    public async Task TearDown()
    {
        await _dbContext.DisposeAsync();
        _sqliteConnection.Close();
        _sqliteConnection.Dispose();
    }

    [Test]
    public async Task CreateAsync_CorrectDataGiven_ReturnCreatedResourceCode()
    {
        // Arrange
        var code = "RT-1001";
        var resource = new ResourceProvider()
            .WithAlphanumericCode(code)
            .Provide();
        // Act
        var resultCode = await _resourceRepository.CreateAsync(resource);

        // Assert
        resultCode.Should().Be(code);
    }

    [Test]
    public async Task CreateAsync_GiveSameCode_ThrowExeption()
    {
        // Arrange
        var code = "RT-1001";
        var resource1 = new ResourceProvider()
            .WithAlphanumericCode(code)
            .Provide();
        var resource2 = new ResourceProvider()
            .WithAlphanumericCode(code)
            .Provide();
        // Act
        var resultCode1 = await _resourceRepository.CreateAsync(resource1);

        // Assert
        await _resourceRepository
            .Invoking(r => r.CreateAsync(resource2))
            .Should()
            .ThrowAsync<DbUpdateException>();
    }

    [Test]
    public async Task FindByCodeAsync_ResourceExists_ReturnResource()
    {
        // Arrange
        var code = "RT-1001";
        var resource = new ResourceProvider()
            .WithAlphanumericCode(code)
            .Provide();
        await _resourceRepository.CreateAsync(resource);
        // Act
        var resultResource = await _resourceRepository.FindByCodeAsync(code);
        // Assert
        resultResource.Should().NotBeNull();
        resultResource!.AlphanumericCode.Should().Be(code);
    }

    [Test]
    public async Task FindByCodeAsync_ResourceDoesNotExist_ReturnNull()
    {
        // Arrange
        var code = "RT-1001";
        // Act
        var resultResource = await _resourceRepository.FindByCodeAsync(code);
        // Assert
        resultResource.Should().BeNull();
    }

    [Test]
    public async Task GetAllAssync_ResourcesExist_ReturnAllResources()
    {
        // Arrange
        var resources = new ResourceProvider().ProvideList();
        foreach (var resource in resources)
        {
            await _resourceRepository.CreateAsync(resource);
        }
        // Act
        var resultResources = await _resourceRepository.GetAllAssync();

        // Assert
        resultResources.Should().HaveCount(3);
    }

    [Test]
    public void GetAllQueryable_ResourcesExist_ReturnAllResourcesAsQueryable()
    {
        // Arrange
        var resources = new ResourceProvider().ProvideList();
        foreach (var resource in resources)
        {
            _resourceRepository.CreateAsync(resource).Wait();
        }
        // Act
        var resultResources = _resourceRepository.GetAllQueryable();
        // Assert
        resultResources.Should().HaveCount(3);
    }

    [Test]
    public async Task UpdateAsync_UpdateExistingResource_ReturnUpdatedResource()
    {
        // Arrange
        var code = "RT-1001";
        var resource = new ResourceProvider()
            .WithAlphanumericCode(code)
            .WithDescription("Old Description")
            .Provide();
        await _resourceRepository.CreateAsync(resource);
        var updateDTO = new ResourceUpdateDTO
        {
            Description = "New Description"
        };
        // Act
        var updatedResource = await _resourceRepository.UpdateAsync(code, updateDTO);
        // Assert
        updatedResource.Should().NotBeNull();
        updatedResource!.Description.Should().Be("New Description");
    }

    [Test]
    public async Task UpdateAsync_ResourceDoesNotExist_ThrowKeyNotFoundException()
    {
        // Arrange
        var code = "RT-1001";
        var updateDTO = new ResourceUpdateDTO
        {
            Description = "New Description"
        };
        // Act & Assert
        await _resourceRepository
            .Invoking(r => r.UpdateAsync(code, updateDTO))
            .Should()
            .ThrowAsync<KeyNotFoundException>();
    }

    [Test]
    public async Task UpdateStatusAsync_ResourceExists_ReturnUpdatedResource()
    {
        // Arrange
        var code = "RT-1001";
        var resource = new ResourceProvider()
            .WithAlphanumericCode(code)
            .WithStatus(ResourceStatus.Active)
            .Provide();
        await _resourceRepository.CreateAsync(resource);
        // Act
        var updatedResource = await _resourceRepository.UpdateStatusAsync(code, ResourceStatus.Inactive);
        // Assert
        updatedResource.Should().NotBeNull();
        updatedResource!.Status.Should().Be(ResourceStatus.Inactive);
    }

    [Test]
    public async Task UpdateStatusAsync_ResourceDoesNotExist_ThrowKeyNotFoundException()
    {
        // Arrange
        var code = "RT-1001";
        // Act & Assert
        await _resourceRepository
            .Invoking(r => r.UpdateStatusAsync(code, ResourceStatus.Inactive))
            .Should()
            .ThrowAsync<KeyNotFoundException>();
    }
}
