using SchedulePlanning.DTOs;
using SchedulePlanning.Enums;
using SchedulePlanning.Services.Interfaces;

namespace SchedulePlanning.Services;
public class PlanningService(
    IAlgorithmRunnerService algorithmRunner,
    ILogger<PlanningService> logger) : IPlanningService
{
    public async Task<DailyScheduleResponseDto> GenerateDailyScheduleAsync(
        DateOnly date,
        AlgorithmType algorithmType,
        List<VVNDto> visits,
        List<StaffDto> allStaff,
        int? timeLimitMs)
    {


        if (visits.Count == 0) throw new Exception("No VVNs found for that day!");

        var validVisits = visits
            .Where(v => v.CargoLoadManifest?.CargoItems.Count > 0 || v.CargoUnloadManifest?.CargoItems.Count > 0)
            .ToList();

        if (validVisits.Count == 0) throw new Exception("No valid VVNs found for that day!");

        var qualificationCode = validVisits
            .SelectMany(v => v.Dock?.Cranes ?? [])
            .Where(c => c.Qualifications.Count > 0)
            .SelectMany(c => c.Qualifications.Select(q => q.Code))
            .FirstOrDefault()
            ?? throw new Exception("No cranes with qualifications found in any VVN!");

        var validStaff = allStaff
            .Where(s => s.IsActive &&
                        s.Qualifications != null &&
                        s.Qualifications.Any(q => q.Code.Equals(qualificationCode)) &&
                        s.OperationalWindows.Count != 0)
            .ToList();

        if (validStaff.Count == 0) throw new Exception("Qualified staff not founded | Staff with operational window not founded");

        var vvnGoupedByDock = validVisits
            .Where(v => v.Dock != null)
            .GroupBy(v => v.Dock!.Code)
            .ToList();

        DailyScheduleResponseDto returnDTO = new()
        {
            Items = []
        };

        foreach (var group in vvnGoupedByDock)
        {
            List<VVNDto> groupVvns = [.. group];
            DailyScheduleResponseDto groupResult = new();

            switch (algorithmType)
            {
                case (AlgorithmType.Optimal):
                case (AlgorithmType.Heuristic):
                    groupResult = await algorithmRunner.RunSingleCraneAlgAsync(date, algorithmType, groupVvns, validStaff);
                    groupResult.AlgorithmsUsed.Add(algorithmType);
                    if (groupResult.TotalDelay > 0 || !groupResult.Ok)
                    {
                        groupResult = await algorithmRunner.RunMultiCraneAlgAsync(date, algorithmType, groupVvns, validStaff);
                        if (algorithmType.Equals(AlgorithmType.Optimal))
                        {
                            groupResult.AlgorithmsUsed.Add(AlgorithmType.OptimalMultiCrane);
                        } else if (algorithmType.Equals(AlgorithmType.Heuristic))
                        {
                            groupResult.AlgorithmsUsed.Add(AlgorithmType.HeuristicMultiCrane);
                        }
                    }
                    break;
                case (AlgorithmType.Genetic):
                    groupResult = await algorithmRunner.RunGeneticSingleCraneAlgAsync(date, groupVvns, validStaff);
                    groupResult.AlgorithmsUsed.Add(AlgorithmType.Genetic);
                    if (groupResult.TotalDelay > 0 || !groupResult.Ok)
                    {
                        groupResult = await algorithmRunner.RunGeneticMultiCraneAlgAsync(date, groupVvns, validStaff);
                        groupResult.AlgorithmsUsed.Add(AlgorithmType.GeneticMultiCrane);
                    }
                    break;
                case (AlgorithmType.Auto):
                    var nVisits = groupVvns.Count;
                    var nCranes = groupVvns.First().Dock!.NumberOfCranes;
                    var newAlg = SelectAutoAlgorithm(nVisits, nCranes, timeLimitMs);
                    groupResult = await GenerateDailyScheduleAsync(date, newAlg, groupVvns, validStaff, timeLimitMs);
                    break;
            }

            if (!groupResult.Ok)
            {
                return groupResult;
            }

            returnDTO.TotalDelay += groupResult.TotalDelay;
            returnDTO.Items.AddRange(groupResult.Items!);
            returnDTO.AlgorithmsUsed.AddRange(groupResult.AlgorithmsUsed);
            returnDTO.ComputeDurationMs += groupResult.ComputeDurationMs;
            returnDTO.Ok = true;
        }
        returnDTO.Date = date;

        return returnDTO;
    }
    
    public async Task<RebalanceComparisonDto> GenerateRebalanceComparisonAsync(
        DateOnly date,
        List<VVNDto> visits,
        List<StaffDto> allStaff,
        List<DockRecordDto> allDocks)
    {
        var oldSchedule = await GenerateDailyScheduleAsync(date, AlgorithmType.Heuristic, visits, allStaff, 0);

        var vesselToDockMapping = await algorithmRunner.RunPrologRebalancing(date, visits, allStaff);
        
        var docksByCode = allDocks.ToDictionary(d => SafeAtom(d.Code), d => d);
        
        var rebalancedVisits = visits.Select(v =>
        {
            var vesselKey = SafeAtom(v.Vessel.Name);
            if (vesselToDockMapping.TryGetValue(vesselKey, out string? newDockKey))
            {
                if (docksByCode.TryGetValue(newDockKey, out DockRecordDto? value))
                {
                    v.Dock = value;
                }
            }
            return v;
        }).ToList();
        
        var newSchedule = await GenerateDailyScheduleAsync(date, AlgorithmType.Heuristic, rebalancedVisits, allStaff, 0);
        
        var dockChanges = visits
            .Where(v =>
            {
                var vesselKey = SafeAtom(v.Vessel.Name);
                return vesselToDockMapping.ContainsKey(vesselKey) &&
                       vesselToDockMapping[vesselKey] != SafeAtom(v.Dock?.Code);
            })
            .Select(v => new VesselDockChangeDto
            {
                VVNCode = v.Code,
                VesselName = v.Vessel.Name,
                OldDock = v.Dock?.Code ?? "unknown",
                NewDock = vesselToDockMapping[SafeAtom(v.Vessel.Name)]
            })
            .ToList();

        return new RebalanceComparisonDto
        {
            OldSchedule = oldSchedule,
            NewSchedule = newSchedule,
            DockChanges = dockChanges
        };
    }

    private static string SafeAtom(string? s)
    {
        if (string.IsNullOrWhiteSpace(s))
            return "unknown";
        return s.ToLower().Replace(" ", "_").Replace("-", "_");
    }

    private AlgorithmType SelectAutoAlgorithm(int nVisits, int nCranes, int? timeLimitMs)
    {
        if (timeLimitMs.HasValue && timeLimitMs.Value > 0 && timeLimitMs.Value <= 1000)
        {
            logger.LogInformation(
                "Inputs: Visits={Visits}, Cranes={Cranes}, TimeLimitMs={TimeLimitMs}\n" +
                "Auto selection rule applied: timeLimitMs <= 1000 -> Heuristic)",
                nVisits, nCranes, timeLimitMs);

            return AlgorithmType.Heuristic;
        }

        if (nVisits <= 6)
        {
            logger.LogInformation(
                "Inputs: Visits={Visits}, Cranes={Cranes}, TimeLimitMs={TimeLimitMs}\n" +
                "Auto selection rule applied: nVisits <= 6 -> Optimal",
                nVisits, nCranes, timeLimitMs);

            return AlgorithmType.Optimal;
        }

        if (nVisits <= 8)
        {
            logger.LogInformation(
                "Inputs: Visits={Visits}, Cranes={Cranes}, TimeLimitMs={TimeLimitMs}\n" +
                "Auto selection rule applied: 6 < nVisits <= 8 -> Heuristic",
                nVisits, nCranes, timeLimitMs);

            return AlgorithmType.Heuristic;
        }

        logger.LogInformation(
            "Inputs: Visits={Visits}, Cranes={Cranes}, TimeLimitMs={TimeLimitMs}\n" +
            "Auto selection rule applied: nVisits > 8 -> Genetic",
            nVisits, nCranes, timeLimitMs);

        return AlgorithmType.Genetic;
    }
}
    