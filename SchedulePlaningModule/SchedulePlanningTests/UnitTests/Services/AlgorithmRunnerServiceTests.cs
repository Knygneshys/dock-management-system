using FluentAssertions;
using Microsoft.AspNetCore.Hosting;
using Moq;
using SchedulePlanning.DTOs;
using SchedulePlanning.Enums;
using SchedulePlanning.Services;
using SchedulePlanningTests.UnitTests.Helpers;
using System.Reflection;

namespace SchedulePlanningTests.UnitTests.Services;

public class AlgorithmRunnerServiceTests
{
    private readonly Mock<IWebHostEnvironment> _envMock;
    private readonly AlgorithmRunnerService _service;
    private static readonly DateTime WeekStart = new(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc);
    private static readonly string TestPrologPath;

    static AlgorithmRunnerServiceTests()
    {
        var testAssemblyLocation = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location)
            ?? throw new DirectoryNotFoundException();

        TestPrologPath = Path.Combine(
            Directory.GetParent(testAssemblyLocation)!.Parent!.Parent!.FullName,
            "IARTI_SchedulingTestsData");
    }

    public AlgorithmRunnerServiceTests()
    {
        _envMock = new Mock<IWebHostEnvironment>();

        _envMock.Setup(e => e.ContentRootPath).Returns(TestPrologPath);

        _service = new AlgorithmRunnerService(_envMock.Object);
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
            OperationalWindows = [OperationalWindowProvider.OpWinForStartAndEndTime(48, 71),
                                  OperationalWindowProvider.OpWinForStartAndEndTime(72, 80)]
        };
        List<StaffDto> staffs = [staff1, staff2];
        // Act
        var res = await _service.RunSingleCraneAlgAsync(date, AlgorithmType.Heuristic, visits, staffs);

        // Assert
        var itemTest = new DailyScheduleItemDto()
        {
            VVNCode = 2,
            Start = 4,
            End = 11,
            CraneCodes = ["crane1"],
            StaffCodes = [1],
            DockCode = "dock1"
        };
        res.Should().NotBeNull();
        res.Date.Should().Be(date);
        res.TotalDelay.Should().Be(191);
        res.Items.Should().ContainEquivalentOf(itemTest);
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
            OperationalWindows = [OperationalWindowProvider.OpWinForStartAndEndTime(48, 71),
                                  OperationalWindowProvider.OpWinForStartAndEndTime(72, 80)]
        };
        List<StaffDto> staffs = [staff1, staff2];
        // Act
        var res = await _service.RunSingleCraneAlgAsync(date, AlgorithmType.Optimal, visits, staffs);

        // Assert
        var itemTest = new DailyScheduleItemDto()
        {
            VVNCode = 2,
            Start = 8,
            End = 15,
            CraneCodes = ["crane1"],
            StaffCodes = [1],
            DockCode = "dock1"
        };
        res.Should().NotBeNull();
        res.Date.Should().Be(date);
        res.TotalDelay.Should().Be(103);
        res.Items.Should().ContainEquivalentOf(itemTest);
    }

    [Test]
    public async Task GenerateDailyScheduleAsync_TestGeneticSingleCrane_ReturnsCorrectData()
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
                }
            ]
        };
        VVNDto visit1 = VVNProvider.ProvideFullDTO(1, dock1, WeekStart.AddHours(0), WeekStart.AddHours(10), 8, null);
        VVNDto visit2 = VVNProvider.ProvideFullDTO(2, dock1, WeekStart.AddHours(4), WeekStart.AddHours(10), 6, 2);
        VVNDto visit3 = VVNProvider.ProvideFullDTO(3, dock1, WeekStart.AddHours(10), WeekStart.AddHours(36), null, 4);
        VVNDto visit4 = VVNProvider.ProvideFullDTO(4, dock1, WeekStart.AddHours(5), WeekStart.AddHours(18), 4, 5);
        VVNDto visit5 = VVNProvider.ProvideFullDTO(5, dock1, WeekStart.AddHours(5), WeekStart.AddHours(12), 1, 2);
        VVNDto visit6 = VVNProvider.ProvideFullDTO(6, dock1, WeekStart.AddHours(10), WeekStart.AddHours(15), 4, 6);
        VVNDto visit7 = VVNProvider.ProvideFullDTO(7, dock1, WeekStart.AddHours(14), WeekStart.AddHours(23), 5, 5);

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
            OperationalWindows = [OperationalWindowProvider.OpWinForStartAndEndTime(48, 71),
                                  OperationalWindowProvider.OpWinForStartAndEndTime(72, 80)]
        };
        List<StaffDto> staffs = [staff1, staff2];

        // Act
        var res = await _service.RunGeneticSingleCraneAlgAsync(date, visits, staffs);

        // Assert
        res.Should().NotBeNull();
        res.Date.Should().Be(date);
        res.TotalDelay.Should().BeGreaterThan(70);
        res.TotalDelay.Should().BeLessThan(92);
    }
    [Test]
    public async Task GenerateDailyScheduleAsync_TestGeneticMultiCrane_ReturnsCorrectData()
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
        VVNDto visit2 = VVNProvider.ProvideFullDTO(2, dock1, WeekStart.AddHours(4), WeekStart.AddHours(10), 6, 2);
        VVNDto visit3 = VVNProvider.ProvideFullDTO(3, dock1, WeekStart.AddHours(10), WeekStart.AddHours(36), null, 4);
        VVNDto visit4 = VVNProvider.ProvideFullDTO(4, dock1, WeekStart.AddHours(5), WeekStart.AddHours(18), 4, 5);
        VVNDto visit5 = VVNProvider.ProvideFullDTO(5, dock1, WeekStart.AddHours(5), WeekStart.AddHours(12), 1, 2);
        VVNDto visit6 = VVNProvider.ProvideFullDTO(6, dock1, WeekStart.AddHours(10), WeekStart.AddHours(15), 4, 6);
        VVNDto visit7 = VVNProvider.ProvideFullDTO(7, dock1, WeekStart.AddHours(14), WeekStart.AddHours(23), 5, 5);

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
        var res = await _service.RunGeneticMultiCraneAlgAsync(date, visits, staffs);

        // Assert
        res.Should().NotBeNull();
        res.Date.Should().Be(date);
        res.TotalDelay.Should().BeGreaterThanOrEqualTo(0);
        res.TotalDelay.Should().BeLessThan(20);
    }

    [Test]
    public async Task GenerateDailyScheduleAsync_TestHeuristicMultiCrane_ReturnsCorrectData()
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
        var res = await _service.RunMultiCraneAlgAsync(date, AlgorithmType.Heuristic, visits, staffs);

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
    }

    [Test]
    public async Task GenerateDailyScheduleAsync_TestOptimalMultiCrane_ReturnsCorrectData()
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
        var res = await _service.RunMultiCraneAlgAsync(date, AlgorithmType.Optimal, visits, staffs);

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
    }
}
