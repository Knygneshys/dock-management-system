using JadeWesserPort.Controllers;
using JadeWesserPort.Data;
using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Data.Repositories;
using JadeWesserPort.Domain.System;
using JadeWesserPort.Mappers;
using JadeWesserPort.Services;
using JadeWesserPort.Services.Interfaces;
using JWPTests.Helpers;
using JWPTests.Services;
using JWPTests.Services.Interfaces;
using Mapster;
using MapsterMapper;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;

namespace JWPTests;
internal class TestContext : IAsyncDisposable
{
    private readonly JWPDbContext _dbContext;
    private readonly SqliteConnection? _sqliteConnection;
    private readonly Mock<IAuthService> _mockAuthService;
    private readonly bool _useSqliteInMemory;

    private bool _disposed;

    public TestContext(bool useSqliteInMemory = false)
    {
        _useSqliteInMemory = useSqliteInMemory;

        if (_useSqliteInMemory)
        {
            var (context, connection) = JwpInMemoryDbContext.GetSqliteInMemoryContext();
            _dbContext = context;
            _sqliteConnection = connection;
        }
        else
        {
            _dbContext = JwpInMemoryDbContext.GetContext();
            _sqliteConnection = null;
        }

        _mockAuthService = new Mock<IAuthService>();
        SetupDefaultMocks();

        InitRepositories();
        InitServices();
        InitControllers();
    }

    private void SetupDefaultMocks()
    {
        _mockAuthService.Setup(
            x => x.UserIsAuthorizedByAuth0IdAsync(
                It.IsAny<string>(),
                It.IsAny<UserRole>()))
            .ReturnsAsync(true);
        _mockAuthService.Setup(
            x => x.GetUserEmailByAuth0IdAsync(It.IsAny<string>()))
            .ReturnsAsync("test.user@example.com");
    }

    public void SetupUserEmail(string email)
    {
        _mockAuthService.Setup(
            x => x.GetUserEmailByAuth0IdAsync(It.IsAny<string>()))
            .ReturnsAsync(email);
    }

    public JWPDbContext DbContext => _dbContext;
    public IAuthService AuthService => _mockAuthService.Object;
    public Mock<IAuthService> MockAuthService => _mockAuthService;

    //Repos
    public IStockItemsRepository StockItemRepository { get; private set; } = default!;
    public ICompanyRepository CompanyRepository { get; private set; } = default!;
    public IDockRecordRepository DockRecordRepository { get; private set; } = default!;
    public IQualificationRepository QualificationRepository { get; private set; } = default!;
    public IResourceRepository ResourceRepository { get; private set; } = default!;
    public IShiftRepository ShiftRepository { get; private set; } = default!;
    public IShippingAgentRepresentativeRepository ShippingAgentRepresentativeRepository { get; private set; } = default!;
    public IStaffRepository StaffRepository { get; private set; } = default!;
    public IStorageAreaRepository StorageAreaRepository { get; private set; } = default!;
    public IUserRepository UserRepository { get; private set; } = default!;
    public IVesselRepository VesselRepository { get; private set; } = default!;
    public IVesselTypeRepository VesselTypeRepository { get; private set; } = default!;
    public IVVNRepository VVNRepository { get; private set; } = default!;
    public IDockStorageDistanceRepository DockStorageDistanceRepository { get; private set; } = default!;

    //Services
    public IDockAvailabilityService DockAvailabilityService { get; private set; } = default!;
    public IDockRecordService DockRecordService { get; private set; } = default!;
    public IQualificationService QualificationService { get; private set; } = default!;
    public IResourceService ResourceService { get; private set; } = default!;
    public IShippingAgentRepService ShippingAgentRepService { get; private set; } = default!;
    public IStaffService StaffService { get; private set; } = default!;
    public IVesselService VesselService { get; private set; } = default!;
    public IVesselTypeService VesselTypeService { get; private set; } = default!;
    public IPortLayoutService PortLayoutService { get; private set; } = default!;
    public IVVNService VVNService { get; private set; } = default!;

    //Controllers
    public DockRecordsController DockRecordsController { get; private set; } = default!;
    public DockStorageDistancesController DockStorageDistancesController { get; private set; } = default!;
    public QualificationsController QualificationsController { get; private set; } = default!;
    public ResourcesController ResourcesController { get; private set; } = default!;
    public ShippingAgentRepresentativesController ShippingAgentRepresentativesController { get; private set; } = default!;
    public StaffMembersController StaffMembersController { get; private set; } = default!;
    public StorageAreasController StorageAreasController { get; private set; } = default!;
    public UsersController UsersController { get; private set; } = default!;
    public VesselsController VesselsController  { get; private set; } = default!;
    public VesselVisitNotificationsController VesselVisitNotificationsController { get; private set; } = default!;

    private void InitRepositories()
    {
        StockItemRepository = new StockItemRepository(_dbContext);
        CompanyRepository = new CompanyRepository(_dbContext);
        DockRecordRepository = new DockRecordRepository(_dbContext);
        QualificationRepository = new QualificationRepository(_dbContext);
        ResourceRepository = new ResourceRepository(_dbContext);
        ShiftRepository = new ShiftRepository(_dbContext);
        ShippingAgentRepresentativeRepository = new ShippingAgentRepresentativeRepository(_dbContext);
        StaffRepository = new StaffRepository(_dbContext);
        StorageAreaRepository = new StorageAreaRepository(_dbContext);
        UserRepository = new UserRepository(_dbContext);
        VesselRepository = new VesselRepository(_dbContext);
        VesselTypeRepository = new VesselTypeRepository(_dbContext);
        VVNRepository = new VVNRepository(_dbContext);
        DockStorageDistanceRepository = new DockStorageDistanceRepository(_dbContext);
    }

    private void InitServices()
    {
        var mapper = CreateMapper();
        DockAvailabilityService = new DockAvailabilityService(
            DockRecordRepository
        );
        DockRecordService = new DockRecordService(
            DockRecordRepository
        );
        QualificationService = new QualificationService(
            QualificationRepository,
            mapper
        );
        ResourceService = new ResourceService(
            ResourceRepository
        );
        ShippingAgentRepService = new ShippingAgentRepService(
            ShippingAgentRepresentativeRepository,
            CompanyRepository,
            UserRepository,
            mapper
        );
        StaffService = new StaffService(
            StaffRepository,
            mapper,
            QualificationRepository,
            ResourceRepository,
            ShiftRepository
        );
        VesselService = new VesselService(
            VesselRepository
        );
        VesselTypeService = new VesselTypeService(
            VesselTypeRepository
        );
        PortLayoutService = new PortLayoutService(
            DockRecordRepository,
            StorageAreaRepository,
            mapper
        );
        VVNService = new VVNService(
            VVNRepository,
            VesselRepository,
            ShippingAgentRepresentativeRepository,
            StockItemRepository,
            DockAvailabilityService,
            PortLayoutService,
            mapper
        );
    }

    private void InitControllers()
    {
        var mapper = CreateMapper();
        DockRecordsController = new(
            DockRecordRepository,
            DockRecordService,
            _mockAuthService.Object,
            mapper,
            NullLogger<DockRecordsController>.Instance
        )
        { ControllerContext = AuthHelper.CreateControllerContextWithUser() };

        DockStorageDistancesController = new(
            DockStorageDistanceRepository,
            DockRecordRepository,
            StorageAreaRepository,
            _mockAuthService.Object,
            mapper,
            NullLogger<DockStorageDistancesController>.Instance
        )
        { ControllerContext = AuthHelper.CreateControllerContextWithUser() };

        QualificationsController = new(
            QualificationRepository,
            mapper,
            QualificationService,
            _mockAuthService.Object,
            NullLogger<QualificationsController>.Instance
        )
        { ControllerContext = AuthHelper.CreateControllerContextWithUser() };

        ResourcesController = new(
            ResourceRepository,
            QualificationRepository,
            DockRecordRepository,
            StorageAreaRepository,
            mapper,
            ResourceService,
            _mockAuthService.Object,
            NullLogger<ResourcesController>.Instance
        ) 
        { ControllerContext = AuthHelper.CreateControllerContextWithUser() };

        ShippingAgentRepresentativesController = new(
            mapper,
            ShippingAgentRepService,
            _mockAuthService.Object,
            NullLogger<ShippingAgentRepresentativesController>.Instance
        )
        { ControllerContext = AuthHelper.CreateControllerContextWithUser() };

        StaffMembersController = new(
            StaffRepository,
            mapper,
            StaffService,
            QualificationRepository,
            ShiftRepository,
            _mockAuthService.Object,
            NullLogger<StaffMembersController>.Instance
        )
        { ControllerContext = AuthHelper.CreateControllerContextWithUser() };

        StorageAreasController = new(
            StorageAreaRepository,
            DockRecordRepository,
            DockStorageDistanceRepository,
            _mockAuthService.Object,
            mapper,
            NullLogger<StorageAreasController>.Instance
        )
        { ControllerContext = AuthHelper.CreateControllerContextWithUser() };

        VesselsController = new(
            CompanyRepository,
            VesselRepository,
            VesselTypeRepository,
            VesselService,
            _mockAuthService.Object,
            mapper,
            NullLogger<VesselsController>.Instance
        )
        { ControllerContext = AuthHelper.CreateControllerContextWithUser() };

        VesselVisitNotificationsController = new(
            VVNRepository,
            mapper,
            _mockAuthService.Object,
            VVNService,
            NullLogger<VesselVisitNotificationsController>.Instance
        )
        { ControllerContext = AuthHelper.CreateControllerContextWithUser() };
    }

    private static Mapper CreateMapper()
    {
        var config = new TypeAdapterConfig();
        config.Apply(new CargoItemMapper());
        config.Apply(new CargoManifestMapper());
        config.Apply(new CompanyMapper());
        config.Apply(new CrewMemberMapper());
        config.Apply(new DockRecordMapper());
        config.Apply(new DockStorageDistanceMapper());
        config.Apply(new FeedbackMapper());
        config.Apply(new OperationalWindowMapper());
        config.Apply(new QualificationMapper());
        config.Apply(new ResourceMapper());
        config.Apply(new SARMapper());
        config.Apply(new ShiftMapper());
        config.Apply(new StaffMapper());
        config.Apply(new StorageAreaMapper());
        config.Apply(new UserMapper());
        config.Apply(new VesselMapper());
        config.Apply(new VesselTypeMapper());
        config.Apply(new VVNMapper());
        return new Mapper(config);
    }

    public async ValueTask DisposeAsync()
    {
        if (!_disposed)
        {
            if (_dbContext != null)
            {
                await _dbContext.DisposeAsync();
            }

            if (_sqliteConnection != null)
            {
                _sqliteConnection.Close();
                _sqliteConnection.Dispose();
            }

            _disposed = true;
        }

        GC.SuppressFinalize(this);
    }
}
