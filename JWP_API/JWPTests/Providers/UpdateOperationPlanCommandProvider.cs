using JadeWesserPort.Domain.Enums;
using JadeWesserPort.DTOs.OperationPlanDTOs;
using JadeWesserPort.DTOs.PlannedOperationDTOs;

namespace JWPTests.Providers;

public class UpdateOperationPlanCommandProvider
{
    private string _dockCode { get; set; } = "DOCK_CODE";
    private List<string> _craneCode { get; set; } = ["CRANE_CODE"];
    private List<int> _staffCode { get; set; } = [1005];
    private string _storageAreaCode { get; set; } = "STORAGE_AREA_CODE";
    private DateTime _start { get; set; } = DateTime.Parse("2026-01-02T07:00:00");
    private DateTime _end { get; set; } = DateTime.Parse("2026-01-02T07:14:00");
    private AlgorithmType _usedAlgorithm { get; set; } = AlgorithmType.Heuristic;
    private string _creatorUserEmail { get; set; } = "test@gmail.com";
private List<PlannedOperationDto> _plannedOperations { get; set; } = [
    new() {
        Start = DateTime.Parse("2026-01-02T07:00:00"),
        End = DateTime.Parse("2026-01-02T07:05:00"),
        From = new() { Bay = 7, Row = 3, Tier = 6 },
        To = new() { Bay = 12, Row = 11, Tier = 1 },
        ContainerId = "MX8520147"
    },
    new() {
        Start = DateTime.Parse("2026-01-02T07:05:00"),
        End = DateTime.Parse("2026-01-02T07:07:00"),
        From = new() { Bay = 4, Row = 14, Tier = 10 },
        To = new() { Bay = 15, Row = 7, Tier = 12 },
        ContainerId = "MX3698521"
    },
    new() {
        Start = DateTime.Parse("2026-01-02T07:07:00"),
        End = DateTime.Parse("2026-01-02T07:11:00"),
        From = new() { Bay = 13, Row = 5, Tier = 2 },
        To = new() { Bay = 6, Row = 13, Tier = 9 },
        ContainerId = "MX7412580"
    },
    new() {
        Start = DateTime.Parse("2026-01-02T07:11:00"),
        End = DateTime.Parse("2026-01-02T07:14:00"),
        From = new() { Bay = 2, Row = 10, Tier = 4 },
        To = new() { Bay = 9, Row = 1, Tier = 7 },
        ContainerId = "MX9630258"
    }
];


    public UpdateOperationPlanCommand Provide()
    {
        return new UpdateOperationPlanCommand()
        {
            DockCode = _dockCode,
            CraneCodes = _craneCode,
            StaffCodes = _staffCode,
            StorageAreaCode = _storageAreaCode,
            Start = _start,
            End = _end,
            UsedAlgorithm = _usedAlgorithm,
            CreatorUserEmail = _creatorUserEmail,
            PlannedOperations = _plannedOperations,
        };
    }

    public UpdateOperationPlanCommandProvider WithDockCode(string dockCode)
    {
        _dockCode = dockCode;
        return this;
    }

    public UpdateOperationPlanCommandProvider WithCraneCodes(List<string> craneCodes)
    {
        _craneCode = craneCodes;
        return this;
    }

    public UpdateOperationPlanCommandProvider WithStaffCodes(List<int> staffCodes)
    {
        _staffCode = staffCodes;
        return this;
    }

    public UpdateOperationPlanCommandProvider WithStorageAreaCode(string storageAreaCode)
    {
        _storageAreaCode = storageAreaCode;
        return this;
    }

    public UpdateOperationPlanCommandProvider WithStart(DateTime start)
    {
        _start = start;
        return this;
    }

    public UpdateOperationPlanCommandProvider WithEnd(DateTime end)
    {
        _end = end;
        return this;
    }

    public UpdateOperationPlanCommandProvider WithUsedAlgorithm(AlgorithmType usedAlgorithm)
    {
        _usedAlgorithm = usedAlgorithm;
        return this;
    }

    public UpdateOperationPlanCommandProvider WithCreatorUserEmail(string creatorUserEmail)
    {
        _creatorUserEmail = creatorUserEmail;
        return this;
    }

    public UpdateOperationPlanCommandProvider WithPlannedOperations(List<PlannedOperationDto> plannedOperations)
    {
        _plannedOperations = plannedOperations;
        return this;
    }
}