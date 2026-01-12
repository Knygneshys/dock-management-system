using FluentAssertions;
using JadeWesserPort.Controllers;
using JadeWesserPort.Domain.Entities;
using JadeWesserPort.Domain.Entities.ValueObjects;
using JadeWesserPort.Domain.Enums;
using JadeWesserPort.Domain.System;
using JadeWesserPort.DTOs.CargoItemDTOs;
using JadeWesserPort.DTOs.CargoManifestDTOs;
using JadeWesserPort.DTOs.VVNDTOs;
using JWPTests.Providers;
using Microsoft.AspNetCore.Mvc;

namespace JWPTests.Controllers;

[TestFixture]
public class VesselVisitNotificationsControllerTests
{
    private TestContext _context;
    private VesselVisitNotificationsController _vvnController;

    private readonly string _vesselImo = "IMO 1008976";
    private readonly string _sarEmail = "sar@test";

    [SetUp]
    public async Task SetUp()
    {
        _context = new TestContext();
        _context.SetupUserEmail(_sarEmail);
        _vvnController = _context.VesselVisitNotificationsController;

        var vesselType = new VesselTypeProvider().Provide();
        await _context.VesselTypeRepository.CreateAsync(vesselType);
        var vessel = new VesselProvider().WithType(vesselType).WithImo(_vesselImo).Provide();
        await _context.VesselRepository.CreateAsync(vessel);
        
        var sar = new UserProvider().WithEmail(_sarEmail).WithRole(UserRole.ShippingAgentRepresentative).Provide();
        var sar2 = new ShippingAgentRepresentativeProvider().WithEmail(_sarEmail).WithUser(sar).Provide();
        await _context.UserRepository.CreateAsync(sar);
        await _context.ShippingAgentRepresentativeRepository.CreateAsync(sar2);
    }

    [TearDown]
    public async Task TearDown()
    {
        await _context.DisposeAsync();
    }

    [Test]
    public async Task CreateMainteneceAsync_CorrectData_ReturnCorrectCode()
    {
        //Arrange
        var vvnDto = new VVNCreateDTO()
        {
            Code = 5,
            Eta = DateTime.UtcNow.AddDays(5),
            Etd = DateTime.UtcNow.AddDays(6),
            VesselImo = _vesselImo
        };

        //Act
        var result = await _vvnController.CreateMainteneceAsync(vvnDto);

        //Assert
        result.Result.Should().BeOfType<OkObjectResult>();
    }

    [Test]
    public async Task CreateMainteneceAsync_IncorrectImo_ThrowExeption()
    {
        //Arrange
        var vvnDto = new VVNCreateDTO()
        {
            Code = 5,
            Eta = DateTime.UtcNow.AddDays(5),
            Etd = DateTime.UtcNow.AddDays(6),
            VesselImo = "non existent"
        };

        //Act
        var result = await _vvnController.CreateMainteneceAsync(vvnDto);

        //Assert
        result.Result.Should().BeOfType<BadRequestObjectResult>();
    }

    [Test]
    public async Task CreateLoadAsync_CorrectData_ReturnCorrectCode()
    {
        //Arrange
        var cargoItemISO = "ISO4932f93";
        var stockItem = new StockItem()
        {
            ContainerISO = cargoItemISO,
            Description = "d",
            From = "From",
            To = "To"
        };
        var storage = new StorageAreaProvider().Provide();
        stockItem.StorageArea = storage;
        await _context.StockItemRepository.CreateAsync(stockItem);

        var vvnDto = new LoadVVNCreateDTO()
        {
            Code = 5,
            Eta = DateTime.UtcNow.AddDays(5),
            Etd = DateTime.UtcNow.AddDays(6),
            VesselImo = _vesselImo,
            CargoManifestDTO = new LoadCargoManifestDTO()
            {
                Code = "code",
                Description = "test",
                CargoType = CargoType.Liquid,
                CargoItemCodes = [
                    cargoItemISO
                    ]
            }

        };

        //Act
        var result = await _vvnController.CreateLoadAsync(vvnDto);

        //Assert
        result.Result.Should().BeOfType<OkObjectResult>();
    }

    [Test]
    public async Task CreateLoadAsync_IncorrectcargoItem_ThrowExeption()
    {
        //Arrange
        var vvnDto = new LoadVVNCreateDTO()
        {
            Code = 5,
            Eta = DateTime.UtcNow.AddDays(5),
            Etd = DateTime.UtcNow.AddDays(6),
            VesselImo = _vesselImo,
            CargoManifestDTO = new LoadCargoManifestDTO()
            {
                Code = "code",
                Description = "test",
                CargoType = CargoType.Liquid,
                CargoItemCodes = [
                    "non existent"
                    ]
            }
        };

        var result = await _vvnController.CreateLoadAsync(vvnDto);

        //Assert
        result.Result.Should().BeOfType<NotFoundObjectResult>();
    }

    [Test]
    public async Task CreateUnloadAsync_CorrectData_ReturnCorrectCode()
    {
        //Arrange
        var cargoItemIso = "ISO4932f93";
        var vvnDto = new UnloadVVNCreateDTO()
        {
            Code = 5,
            Eta = DateTime.UtcNow.AddDays(5),
            Etd = DateTime.UtcNow.AddDays(6),
            VesselImo = _vesselImo,
            CargoManifestDTO = new UnloadCargoManifestDTO()
            {
                Code = "code",
                Description = "test",
                CargoType = CargoType.Liquid,
                CargoItems = [
                    new CargoItemDTO(){
                        ContainerISO = cargoItemIso,
                        Description = "d",
                        From = "From",
                        To = "To",
                        VesselContainerPosition = new ContainerPosition()
                    }
                ]
            }
        };

        //Act
        var result = await _vvnController.CreateUnloadAsync(vvnDto);

        //Assert
        result.Result.Should().BeOfType<OkObjectResult>();
    }
}
