using FluentAssertions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using SchedulePlanning.DTOs;
using SchedulePlanning.Enums;
using SchedulePlanning.Services;
using SchedulePlanningTests.UnitTests.Helpers;
using System.Reflection;

namespace SchedulePlanningTests.UnitTests.Services;

public class PlanningServiceTests
{
    private readonly Mock<IWebHostEnvironment> _envMock;
    private readonly AlgorithmRunnerService _algRunnerService;
    private readonly PlanningService _planningService;
    private static readonly DateTime WeekStart = new(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc);
    private static readonly string TestPrologPath;

    static PlanningServiceTests()
    {
        var testAssemblyLocation = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location)
            ?? throw new DirectoryNotFoundException();

        TestPrologPath = Path.Combine(
            Directory.GetParent(testAssemblyLocation)!.Parent!.Parent!.FullName,
            "IARTI_SchedulingTestsData");
    }

    public PlanningServiceTests()
    {
        _envMock = new Mock<IWebHostEnvironment>();
        _envMock.Setup(e => e.ContentRootPath).Returns(TestPrologPath);
        _algRunnerService = new AlgorithmRunnerService(_envMock.Object);
        var logger = NullLogger<PlanningService>.Instance;
        _planningService = new PlanningService(_algRunnerService, logger);
    }

    [Test]
    public async Task GenerateDailyScheduleAsync_TestHeuristic_ReturnsCorrectData()
    {
        // Arrange
        var date = new DateOnly(2024, 1, 1);
        QualificationDto qualificationDto = new()
        {
            Code = "ls1",
            Name = "ls1"
        };
        DockRecordDto dock1 = new()
        {
            Code = "dock1",
            Cranes = [
                new(){
                    AlphanumericCode = "crane1",
                    Status = "Active",
                    Qualifications = [qualificationDto]
                },
                new(){
                    AlphanumericCode = "crane2",
                    Status = "Active",
                    Qualifications = [qualificationDto]
                },
                new(){
                    AlphanumericCode = "crane3",
                    Status = "Active",
                    Qualifications = [qualificationDto]
                }
            ]
        };
        VVNDto visit1 = VVNProvider.ProvideFullDTO(1, dock1, WeekStart.AddHours(0), WeekStart.AddHours(10), 8, null);
        VVNDto visit2 = VVNProvider.ProvideFullDTO(2, dock1, WeekStart.AddHours(4), WeekStart.AddHours(9), 6, 2);
        VVNDto visit3 = VVNProvider.ProvideFullDTO(3, dock1, WeekStart.AddHours(6), WeekStart.AddHours(23), null, 4);
        VVNDto visit4 = VVNProvider.ProvideFullDTO(4, dock1, WeekStart.AddHours(8), WeekStart.AddHours(14), 4, 5);
        VVNDto visit5 = VVNProvider.ProvideFullDTO(5, dock1, WeekStart.AddHours(10), WeekStart.AddHours(15), 1, 2);
        VVNDto visit6 = VVNProvider.ProvideFullDTO(6, dock1, WeekStart.AddHours(5), WeekStart.AddHours(13), 4, 6);
        VVNDto visit7 = VVNProvider.ProvideFullDTO(7, dock1, WeekStart.AddHours(7), WeekStart.AddHours(12), 5, 3);

        List<VVNDto> visits = [visit1, visit2, visit3, visit4, visit5, visit6, visit7];

        StaffDto staff1 = new()
        {
            MecanographicNumber = 1,
            IsActive = true,
            Qualifications = [qualificationDto],
            OperationalWindows = [OperationalWindowProvider.OpWinForStartAndEndTime(0, 23),
                                  OperationalWindowProvider.OpWinForStartAndEndTime(24, 47)]
        };
        StaffDto staff2 = new()
        {
            MecanographicNumber = 2,
            IsActive = true,
            Qualifications = [qualificationDto],
            OperationalWindows = [OperationalWindowProvider.OpWinForStartAndEndTime(0, 23),
                                  OperationalWindowProvider.OpWinForStartAndEndTime(24, 47)]
        };
        StaffDto staff3 = new()
        {
            MecanographicNumber = 3,
            IsActive = true,
            Qualifications = [qualificationDto],
            OperationalWindows = [OperationalWindowProvider.OpWinForStartAndEndTime(0, 23),
                                  OperationalWindowProvider.OpWinForStartAndEndTime(24, 47)]
        };
        List<StaffDto> staffs = [staff1, staff2, staff3];
        // Act
        var res = await _planningService.GenerateDailyScheduleAsync(date, AlgorithmType.Heuristic, visits, staffs, 100000);

        // Assert
        var itemTest = new DailyScheduleItemDto()
        {
            VVNCode = 2,
            Start = 4,
            End = 6,
            CraneCodes = ["crane1", "crane2", "crane3"],
            StaffCodes = [1, 2, 3],
            DockCode = "dock1"
        };
        res.Should().NotBeNull();
        res.Date.Should().Be(date);
        res.TotalDelay.Should().Be(17);
        res.Items.Should().ContainEquivalentOf(itemTest);
        res.AlgorithmsUsed.Should().ContainEquivalentOf(AlgorithmType.HeuristicMultiCrane);
    }

    [Test]
    public async Task GenerateDailyScheduleAsync_TestOptimal_ReturnsCorrectData()
    {
        // Arrange
        var date = new DateOnly(2024, 1, 1);
        QualificationDto qualificationDto = new()
        {
            Code = "ls1",
            Name = "ls1"
        };
        DockRecordDto dock1 = new()
        {
            Code = "dock1",
            Cranes = [
                new(){
                        AlphanumericCode = "crane1",
                        Status = "Active",
                        Qualifications = [qualificationDto]
                    },
                    new(){
                        AlphanumericCode = "crane2",
                        Status = "Active",
                        Qualifications = [qualificationDto]
                    },
                    new(){
                        AlphanumericCode = "crane3",
                        Status = "Active",
                        Qualifications = [qualificationDto]
                    }
            ]
        };
        VVNDto visit1 = VVNProvider.ProvideFullDTO(1, dock1, WeekStart.AddHours(0), WeekStart.AddHours(10), 8, null);
        VVNDto visit2 = VVNProvider.ProvideFullDTO(2, dock1, WeekStart.AddHours(4), WeekStart.AddHours(9), 6, 2);
        VVNDto visit3 = VVNProvider.ProvideFullDTO(3, dock1, WeekStart.AddHours(6), WeekStart.AddHours(23), null, 4);
        VVNDto visit4 = VVNProvider.ProvideFullDTO(4, dock1, WeekStart.AddHours(8), WeekStart.AddHours(14), 4, 5);
        VVNDto visit5 = VVNProvider.ProvideFullDTO(5, dock1, WeekStart.AddHours(10), WeekStart.AddHours(15), 1, 2);
        VVNDto visit6 = VVNProvider.ProvideFullDTO(6, dock1, WeekStart.AddHours(5), WeekStart.AddHours(13), 4, 6);
        VVNDto visit7 = VVNProvider.ProvideFullDTO(7, dock1, WeekStart.AddHours(7), WeekStart.AddHours(12), 5, 3);

        List<VVNDto> visits = [visit1, visit2, visit3, visit4, visit5, visit6, visit7];

        StaffDto staff1 = new()
        {
            MecanographicNumber = 1,
            IsActive = true,
            Qualifications = [qualificationDto],
            OperationalWindows = [OperationalWindowProvider.OpWinForStartAndEndTime(0, 23),
                                      OperationalWindowProvider.OpWinForStartAndEndTime(24, 47)]
        };
        StaffDto staff2 = new()
        {
            MecanographicNumber = 2,
            IsActive = true,
            Qualifications = [qualificationDto],
            OperationalWindows = [OperationalWindowProvider.OpWinForStartAndEndTime(0, 23),
                                      OperationalWindowProvider.OpWinForStartAndEndTime(24, 47)]
        };
        StaffDto staff3 = new()
        {
            MecanographicNumber = 3,
            IsActive = true,
            Qualifications = [qualificationDto],
            OperationalWindows = [OperationalWindowProvider.OpWinForStartAndEndTime(0, 23),
                                      OperationalWindowProvider.OpWinForStartAndEndTime(24, 47)]
        };
        List<StaffDto> staffs = [staff1, staff2, staff3];
        // Act
        var res = await _planningService.GenerateDailyScheduleAsync(date, AlgorithmType.Optimal, visits, staffs, 100000);

        // Assert
        var itemTest = new DailyScheduleItemDto()
        {
            VVNCode = 2,
            Start = 4,
            End = 6,
            CraneCodes = ["crane1", "crane2", "crane3"],
            StaffCodes = [1, 2, 3],
            DockCode = "dock1"
        };
        res.Should().NotBeNull();
        res.Date.Should().Be(date);
        res.TotalDelay.Should().Be(5);
        res.Items.Should().ContainEquivalentOf(itemTest);
        res.AlgorithmsUsed.Should().ContainEquivalentOf(AlgorithmType.OptimalMultiCrane);
    }
}
