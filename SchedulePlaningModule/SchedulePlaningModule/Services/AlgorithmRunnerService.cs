using SchedulePlanning.DTOs;
using SchedulePlanning.Enums;
using SchedulePlanning.Services.Interfaces;
using System.Diagnostics;
using System.Text;
using System.Text.Json;

namespace SchedulePlanning.Services;

public class AlgorithmRunnerService(IWebHostEnvironment env) : IAlgorithmRunnerService
{
    public async Task<DailyScheduleResponseDto> RunMultiCraneAlgAsync(
        DateOnly date, 
        AlgorithmType algorithmType, 
        List<VVNDto> validVisits, 
        List<StaffDto> validStaffs)
    {
        if (validVisits.Count == 0) throw new Exception("No valid VVNs found for that day!");
        if (validStaffs.Count == 0) throw new Exception("Qualified staff not founded | Staff with operational window not founded");

        var validCranes = validVisits
            .SelectMany(v => v.Dock?.Cranes ?? [])
                .Where(c => c.Status.Equals(ResourceStatus.Active.ToString()))
            .ToList();

        if (validCranes.Count == 0) throw new Exception("No valid STS Cranes founded");

        var weekStart = GetWeekStartUtc(date);
        int dayIndex = DayIndexInWeek(date);
        var facts = new StringBuilder();

        List<ResourceDto> redCranes = [];

        // VVN's
        foreach (var vvn in validVisits)
        {
            var arrival = HoursFromWeekStart(weekStart, vvn.Eta);
            var depart = HoursFromWeekStart(weekStart, vvn.Etd);
            var unloadingHours = 0;
            var loadingHours = 0;
            if (vvn.CargoLoadManifest is not null)
                loadingHours = (int)Math.Ceiling((double)vvn.CargoLoadManifest.CargoItems.Count / 25);

            if (vvn.CargoUnloadManifest is not null)
                unloadingHours = (int)Math.Ceiling((double)vvn.CargoUnloadManifest.CargoItems.Count / 25);

            facts.AppendLine($"vvn({vvn.Code}, {arrival}, {depart}, {unloadingHours}, {loadingHours}).");

            foreach (var crane in vvn.Dock?.Cranes ?? [])
            {
                if (validCranes.Contains(crane) && !redCranes.Contains(crane))
                {
                    redCranes.Add(crane);
                    facts.AppendLine($"crane({SafeAtom(crane.AlphanumericCode)}).");
                }
            }
        }

        // Staff
        foreach (var s in validStaffs)
        {
            foreach (var ow in s.OperationalWindows)
            {
                var (start, end) = ConvertOperationalWindowToWeekHours(weekStart, ow);
                facts.AppendLine($"staff_window({s.MecanographicNumber}, {start}, {end}).");
            }
        }

        var schedulingFile = Path.Combine(env.ContentRootPath, "IARTI_Scheduling/MultiCrane", "schedulingMultiCrane.pl");
        if (!File.Exists(schedulingFile))
        {
            throw new FileNotFoundException(
                $"Prolog scheduling file not found: {schedulingFile}\n" +
                $"ContentRootPath: {env.ContentRootPath}\n" +
                $"Full path searched: {Path.GetFullPath(schedulingFile)}");
        }
        var tmpFactsFile = Path.Combine(Path.GetTempPath(), $"facts_{Guid.NewGuid():N}.pl");

        await File.WriteAllTextAsync(tmpFactsFile, $":- ['{EscapePath(schedulingFile)}'].\n" + facts);
        string algorithm;
        if (algorithmType.Equals(AlgorithmType.Optimal))
        {
            algorithm = "optimal";
        }
        else
        {
            algorithm = "edt";
        }

        var outputBuilder = new StringBuilder();
        var errorBuilder = new StringBuilder();

        using var proc = Process.Start(new ProcessStartInfo
        {
            FileName = "swipl",
            Arguments = $"-q -s \"{tmpFactsFile}\" -g \"schedule_json({algorithm}),halt.\"",
            RedirectStandardOutput = true,
            RedirectStandardError = true,
            UseShellExecute = false
        }) ?? throw new Exception("Prolog algorithm failed!");

        proc.OutputDataReceived += (s, e) =>
        {
            if (e.Data != null)
                outputBuilder.AppendLine(e.Data);
        };

        proc.ErrorDataReceived += (s, e) =>
        {
            if (e.Data != null)
                errorBuilder.AppendLine(e.Data);
        };

        proc.BeginOutputReadLine();
        proc.BeginErrorReadLine();

        proc.WaitForExit();

        var stdout = outputBuilder.ToString();
        var stderr = errorBuilder.ToString();

        if (string.IsNullOrWhiteSpace(stdout))
            return new DailyScheduleResponseDto { Ok = false, Date = date, Reason = "Prolog returned no output: " + stderr };

        using var doc = JsonDocument.Parse(stdout);
        var root = doc.RootElement;

        if (!root.GetProperty("ok").GetBoolean())
            return new DailyScheduleResponseDto { Ok = false, Date = date, Reason = root.GetProperty("reason").GetString() };

        var delay = root.GetProperty("delay").GetInt32();
        var computeTime = root.GetProperty("computeTime").GetDouble();

        var items = root.GetProperty("items").EnumerateArray()
            .Select(it =>
            {
                var vvnCode = it.GetProperty("vvn").GetInt32();
                var visit = validVisits.First(vvn => vvn.Code.Equals(vvnCode));

                return new DailyScheduleItemDto
                {
                    VVNCode = visit.Code,
                    DockCode = visit.Dock?.Code ?? "error",
                    CraneCodes = ReadStringArray(it.GetProperty("cranes")),
                    StaffCodes = ReadIntArray(it.GetProperty("staffs")),
                    Start = it.GetProperty("start").GetInt32(),
                    End = it.GetProperty("end").GetInt32()
                };
            }).ToList();

        return new DailyScheduleResponseDto { 
            Ok = true, 
            Date = date, 
            TotalDelay = delay, 
            Items = items,
            AlgorithmsUsed = [algorithmType],
            ComputeDurationMs = computeTime
        };
    }

    public async Task<DailyScheduleResponseDto> RunSingleCraneAlgAsync(
        DateOnly date, 
        AlgorithmType algorithmType, 
        List<VVNDto> validVisits, 
        List<StaffDto> validStaffs)
    {
        if (validVisits.Count == 0) throw new Exception("No valid VVNs found for that day!");
        if (validStaffs.Count == 0) throw new Exception("Qualified staff not founded | Staff with operational window not founded");

        var validCranes = validVisits
            .SelectMany(v => v.Dock?.Cranes ?? [])
                .Where(c => c.Status.Equals(ResourceStatus.Active.ToString()))
            .ToList();

        if (validCranes.Count == 0) throw new Exception("No valid STS Cranes founded");

        var weekStart = GetWeekStartUtc(date);
        int dayIndex = DayIndexInWeek(date);
        var facts = new StringBuilder();

        List<ResourceDto> redCranes = [];

        // VVN's
        foreach (var vvn in validVisits)
        {
            var arrival = HoursFromWeekStart(weekStart, vvn.Eta);
            var depart = HoursFromWeekStart(weekStart, vvn.Etd);
            var unloadingHours = 0;
            var loadingHours = 0;
            if (vvn.CargoLoadManifest is not null)
                loadingHours = (int)Math.Ceiling((double)vvn.CargoLoadManifest.CargoItems.Count / 25);

            if (vvn.CargoUnloadManifest is not null)
                unloadingHours = (int)Math.Ceiling((double)vvn.CargoUnloadManifest.CargoItems.Count / 25);

            facts.AppendLine($"vvn({vvn.Code}, {arrival}, {depart}, {unloadingHours}, {loadingHours}).");

            foreach (var crane in vvn.Dock?.Cranes ?? [])
            {
                if (validCranes.Contains(crane) && !redCranes.Contains(crane))
                {
                    redCranes.Add(crane);
                    facts.AppendLine($"crane({SafeAtom(crane.AlphanumericCode)}).");
                }
            }
        }

        // Staff
        foreach (var s in validStaffs)
        {
            foreach (var ow in s.OperationalWindows)
            {
                var (start, end) = ConvertOperationalWindowToWeekHours(weekStart, ow);
                facts.AppendLine($"staff_window({s.MecanographicNumber}, {start}, {end}).");
            }
        }

        var schedulingFile = Path.Combine(env.ContentRootPath, "IARTI_Scheduling/SingleCrane", "schedulingSingleCrane.pl");
        if (!File.Exists(schedulingFile))
        {
            throw new FileNotFoundException(
                $"Prolog scheduling file not found: {schedulingFile}\n" +
                $"ContentRootPath: {env.ContentRootPath}\n" +
                $"Full path searched: {Path.GetFullPath(schedulingFile)}");
        }
        var tmpFactsFile = Path.Combine(Path.GetTempPath(), $"facts_{Guid.NewGuid():N}.pl");

        await File.WriteAllTextAsync(tmpFactsFile, $":- ['{EscapePath(schedulingFile)}'].\n" + facts);
        string algorithm;
        if (algorithmType.Equals(AlgorithmType.Optimal))
        {
            algorithm = "optimal";
        }
        else
        {
            algorithm = "edt";
        }

        var outputBuilder = new StringBuilder();
        var errorBuilder = new StringBuilder();

        using var proc = Process.Start(new ProcessStartInfo
        {
            FileName = "swipl",
            Arguments = $"-q -s \"{tmpFactsFile}\" -g \"schedule_json({algorithm}),halt.\"",
            RedirectStandardOutput = true,
            RedirectStandardError = true,
            UseShellExecute = false
        }) ?? throw new Exception("Prolog algorithm failed!");

        proc.OutputDataReceived += (s, e) =>
        {
            if (e.Data != null)
                outputBuilder.AppendLine(e.Data);
        };

        proc.ErrorDataReceived += (s, e) =>
        {
            if (e.Data != null)
                errorBuilder.AppendLine(e.Data);
        };

        proc.BeginOutputReadLine();
        proc.BeginErrorReadLine();

        proc.WaitForExit();

        var stdout = outputBuilder.ToString();
        var stderr = errorBuilder.ToString();

        if (string.IsNullOrWhiteSpace(stdout))
            return new DailyScheduleResponseDto { Ok = false, Date = date, Reason = "Prolog returned no output: " + stderr };

        using var doc = JsonDocument.Parse(stdout);
        var root = doc.RootElement;

        if (!root.GetProperty("ok").GetBoolean())
            return new DailyScheduleResponseDto { Ok = false, Date = date, Reason = root.GetProperty("reason").GetString() };

        var delay = root.GetProperty("delay").GetInt32();
        var computeTime = root.GetProperty("computeTime").GetDouble();

        var items = root.GetProperty("items").EnumerateArray()
            .Select(it =>
            {
                var vvnCode = it.GetProperty("vvn").GetInt32();
                var visit = validVisits.First(vvn => vvn.Code.Equals(vvnCode));

                return new DailyScheduleItemDto
                {
                    VVNCode = visit.Code,
                    DockCode = visit.Dock?.Code ?? "error",
                    CraneCodes = [it.GetProperty("crane").GetString()!],
                    StaffCodes = [it.GetProperty("staff").GetInt32()!],
                    Start = it.GetProperty("start").GetInt32(),
                    End = it.GetProperty("end").GetInt32()
                };
            }).ToList();

        return new DailyScheduleResponseDto { 
            Ok = true, 
            Date = date, 
            TotalDelay = delay, 
            Items = items,
            AlgorithmsUsed = [algorithmType],
            ComputeDurationMs = computeTime
        };
    }

    public async Task<DailyScheduleResponseDto> RunGeneticSingleCraneAlgAsync(
        DateOnly date, 
        List<VVNDto> validVisits, 
        List<StaffDto> validStaffs)
    {
        if (validVisits.Count == 0) throw new Exception("No valid VVNs found for that day!");
        if (validStaffs.Count == 0) throw new Exception("Qualified staff not founded | Staff with operational window not founded");

        var validCranes = validVisits
            .SelectMany(v => v.Dock?.Cranes ?? [])
                .Where(c => c.Status.Equals(ResourceStatus.Active.ToString()))
            .ToList();

        if (validCranes.Count == 0) throw new Exception("No valid STS Cranes founded");

        var weekStart = GetWeekStartUtc(date);
        int dayIndex = DayIndexInWeek(date);
        var facts = new StringBuilder();

        List<ResourceDto> redCranes = [];

        // Visits
        foreach (var vvn in validVisits)
        {
            var safeVVNCode = $"s{vvn.Code}";
            var arrival = HoursFromWeekStart(weekStart, vvn.Eta);
            var depart = HoursFromWeekStart(weekStart, vvn.Etd);
            var unloadingHours = 0;
            var loadingHours = 0;
            if (vvn.CargoLoadManifest is not null)
                loadingHours = (int)Math.Ceiling((double)vvn.CargoLoadManifest.CargoItems.Count / 25);

            if (vvn.CargoUnloadManifest is not null)
                unloadingHours = (int)Math.Ceiling((double)vvn.CargoUnloadManifest.CargoItems.Count / 25);

            var totalOpTime = unloadingHours + loadingHours;

            facts.AppendLine($"visit({safeVVNCode},{totalOpTime}, {arrival}, {depart}, 1).");

            foreach (var crane in vvn.Dock?.Cranes ?? [])
            {
                if (validCranes.Contains(crane) && !redCranes.Contains(crane))
                {
                    redCranes.Add(crane);
                    facts.AppendLine($"crane({SafeAtom(crane.AlphanumericCode)}).");
                }
            }
        }

        facts.AppendLine($"visits({validVisits.Count}).");

        // Staff
        foreach (var s in validStaffs)
        {
            foreach (var ow in s.OperationalWindows)
            {
                var (start, end) = ConvertOperationalWindowToWeekHours(weekStart, ow);
                facts.AppendLine($"staff_window({s.MecanographicNumber}, {start}, {end}).");
            }
        }

        facts.AppendLine("generations(100).");
        facts.AppendLine("population(5).");
        facts.AppendLine("prob_crossover(0.5).");
        facts.AppendLine("prob_mutation(0.2).");

        var schedulingFile = Path.Combine(env.ContentRootPath, "IARTI_Scheduling/SingleCrane", "schedulingGeneticSingleCraneAlg.pl");
        if (!File.Exists(schedulingFile))
        {
            throw new FileNotFoundException(
                $"Prolog scheduling file not found: {schedulingFile}\n" +
                $"ContentRootPath: {env.ContentRootPath}\n" +
                $"Full path searched: {Path.GetFullPath(schedulingFile)}");
        }
        var tmpFactsFile = Path.Combine(Path.GetTempPath(), $"facts_{Guid.NewGuid():N}.pl");

        await File.WriteAllTextAsync(tmpFactsFile, $":- ['{EscapePath(schedulingFile)}'].\n" + facts);

        using var proc = new Process
        {
            StartInfo = new ProcessStartInfo
            {
                FileName = "swipl",
                Arguments = $"-q --on-error=halt --no-tty -s \"{tmpFactsFile}\" -g \"generate,halt.\"",
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            }
        };

        proc.Start();

        string stdout = await proc.StandardOutput.ReadToEndAsync();
        string stderr = await proc.StandardError.ReadToEndAsync();

        proc.WaitForExit();

        if (string.IsNullOrWhiteSpace(stdout))
            return new DailyScheduleResponseDto { Ok = false, Date = date, Reason = "Prolog returned no output: " + stderr };

        using var doc = JsonDocument.Parse(stdout);
        var root = doc.RootElement;

        var totalDelay = root.GetProperty("total_delay_cost").GetInt32();
        var computeTime = root.GetProperty("computeTime").GetDouble();

        var items = root.GetProperty("schedule").EnumerateArray()
            .Select(it =>
            {
                var vvnCode = it.GetProperty("visit").GetString()!;
                var vvn = validVisits.First(vvn => $"s{vvn.Code}".Equals(vvnCode));

                return new DailyScheduleItemDto
                {
                    VVNCode = vvn.Code,
                    DockCode = vvn.Dock?.Code ?? "error",
                    CraneCodes = [it.GetProperty("crane").GetString()!],
                    StaffCodes = [it.GetProperty("staff").GetInt32()!],
                    Start = it.GetProperty("start").GetInt32(),
                    End = it.GetProperty("finish").GetInt32()
                };
            }).ToList();

        return new DailyScheduleResponseDto
        {
            Ok = true,
            Date = date,
            TotalDelay = totalDelay,
            Items = items,
            AlgorithmsUsed = [AlgorithmType.Genetic],
            ComputeDurationMs = computeTime
        };
    }

    public async Task<DailyScheduleResponseDto> RunGeneticMultiCraneAlgAsync(
        DateOnly date,
        List<VVNDto> validVisits,
        List<StaffDto> validStaffs)
    {
        if (validVisits.Count == 0) throw new Exception("No valid VVNs found for that day!");
        if (validStaffs.Count == 0) throw new Exception("Qualified staff not founded | Staff with operational window not founded");

        var validCranes = validVisits
            .SelectMany(v => v.Dock?.Cranes ?? [])
                .Where(c => c.Status.Equals(ResourceStatus.Active.ToString()))
            .ToList();

        if (validCranes.Count == 0) throw new Exception("No valid STS Cranes founded");

        var weekStart = GetWeekStartUtc(date);
        int dayIndex = DayIndexInWeek(date);
        var facts = new StringBuilder();

        List<ResourceDto> redCranes = [];

        // Visits
        foreach (var vvn in validVisits)
        {
            var arrival = HoursFromWeekStart(weekStart, vvn.Eta);
            var depart = HoursFromWeekStart(weekStart, vvn.Etd);
            var unloadingHours = 0;
            var loadingHours = 0;
            if (vvn.CargoLoadManifest is not null)
                loadingHours = (int)Math.Ceiling((double)vvn.CargoLoadManifest.CargoItems.Count / 25);

            if (vvn.CargoUnloadManifest is not null)
                unloadingHours = (int)Math.Ceiling((double)vvn.CargoUnloadManifest.CargoItems.Count / 25);

            var totalOpTime = unloadingHours + loadingHours;

            facts.AppendLine($"visit({vvn.Code},{totalOpTime}, {arrival}, {depart}, 1).");

            foreach (var crane in vvn.Dock?.Cranes ?? [])
            {
                if (validCranes.Contains(crane) && !redCranes.Contains(crane))
                {
                    redCranes.Add(crane);
                    facts.AppendLine($"crane({SafeAtom(crane.AlphanumericCode)}).");
                }
            }
        }

        facts.AppendLine($"visits({validVisits.Count}).");

        // Staff
        foreach (var s in validStaffs)
        {
            foreach (var ow in s.OperationalWindows)
            {
                var (start, end) = ConvertOperationalWindowToWeekHours(weekStart, ow);
                facts.AppendLine($"staff_window({s.MecanographicNumber}, {start}, {end}).");
            }
        }

        facts.AppendLine("generations(100).");
        facts.AppendLine("population(5).");
        facts.AppendLine("prob_crossover(0.5).");
        facts.AppendLine("prob_mutation(0.2).");

        var schedulingFile = Path.Combine(env.ContentRootPath, "IARTI_Scheduling/MultiCrane", "schedulingGeneticAlgMultiCrane.pl");
        if (!File.Exists(schedulingFile))
        {
            throw new FileNotFoundException(
                $"Prolog scheduling file not found: {schedulingFile}\n" +
                $"ContentRootPath: {env.ContentRootPath}\n" +
                $"Full path searched: {Path.GetFullPath(schedulingFile)}");
        }
        var tmpFactsFile = Path.Combine(Path.GetTempPath(), $"facts_{Guid.NewGuid():N}.pl");

        await File.WriteAllTextAsync(tmpFactsFile, $":- ['{EscapePath(schedulingFile)}'].\n" + facts);

        using var proc = new Process
        {
            StartInfo = new ProcessStartInfo
            {
                FileName = "swipl",
                Arguments = $"-q --on-error=halt --no-tty -s \"{tmpFactsFile}\" -g \"generate,halt.\"",
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            }
        };

        proc.Start();

        string stdout = await proc.StandardOutput.ReadToEndAsync();
        string stderr = await proc.StandardError.ReadToEndAsync();

        proc.WaitForExit();

        if (string.IsNullOrWhiteSpace(stdout))
            return new DailyScheduleResponseDto { Ok = false, Date = date, Reason = "Prolog returned no output: " + stderr };

        using var doc = JsonDocument.Parse(stdout);
        var root = doc.RootElement;

        var totalDelay = root.GetProperty("total_delay_cost").GetInt32();
        var computeTime = root.GetProperty("computeTime").GetDouble();

        var items = root.GetProperty("schedule").EnumerateArray()
            .Select(it =>
            {
                var vvnCode = it.GetProperty("visit").GetInt32()!;
                var vvn = validVisits.First(vvn => vvn.Code.Equals(vvnCode));

                return new DailyScheduleItemDto
                {
                    VVNCode = vvn.Code,
                    DockCode = vvn.Dock?.Code ?? "error",
                    CraneCodes = ReadStringArray(it.GetProperty("cranes")),
                    StaffCodes = ReadIntArray(it.GetProperty("staffs")),
                    Start = it.GetProperty("start").GetInt32(),
                    End = it.GetProperty("finish").GetInt32()
                };
            }).ToList();

        return new DailyScheduleResponseDto
        {
            Ok = true,
            Date = date,
            TotalDelay = totalDelay,
            Items = items,
            AlgorithmsUsed = [AlgorithmType.GeneticMultiCrane],
            ComputeDurationMs = computeTime
        };
    }

    // ==== Helpers ====
    private static string SafeAtom(string? s)
    {
        if (string.IsNullOrWhiteSpace(s))
            return "unknown";
        return s.ToLower().Replace(" ", "_").Replace("-", "_");
    }

    private static string EscapePath(string p)
         => p.Replace("\\", "/");

    private static DateTime GetWeekStartUtc(DateOnly d)
    {
        var dt = d.ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);
        return dt.AddDays(-(((int)dt.DayOfWeek + 6) % 7));
    }

    private static int DayIndexInWeek(DateOnly d) => ((int)d.DayOfWeek + 6) % 7;

    private static int HoursFromWeekStart(DateTime ws, DateTime t) => (int)(t.ToUniversalTime() - ws).TotalHours;

    private static string[] ReadStringArray(JsonElement arrayElement)
    {
        return [.. arrayElement
            .EnumerateArray()
            .Select(e => e.GetString()!)];
    }

    private static int[] ReadIntArray(JsonElement arrayElement)
    {
        return [.. arrayElement
            .EnumerateArray()
            .Select(e => e.GetInt32()!)];
    }

    private static (int start, int end) ConvertOperationalWindowToWeekHours(DateTime weekStart, OperationalWindowDto ow)
    {
        var dayOfWeekEnum = Enum.Parse<DayOfWeek>(ow.DayOfWeek.ToString(), true);
        var dayOffset = ((int)dayOfWeekEnum + 6) % 7;

        var windowDate = weekStart.AddDays(dayOffset);

        var startDt = windowDate
            .AddHours(ow.StartTime.Hours)
            .AddMinutes(ow.StartTime.Minutes);

        var endDt = windowDate
            .AddHours(ow.EndTime.Hours)
            .AddMinutes(ow.EndTime.Minutes);

        var start = HoursFromWeekStart(weekStart, startDt);
        var end = HoursFromWeekStart(weekStart, endDt);

        return (start, end);
    }

    public async Task<Dictionary<string, string>> RunPrologRebalancing(
        DateOnly date,
        List<VVNDto> visits,
        List<StaffDto> allStaff)
    {
        var weekStart = GetWeekStartUtc(date);
        var facts = new StringBuilder();

        foreach (var vvn in visits)
        {
            var arrival = HoursFromWeekStart(weekStart, vvn.Eta);
            var depart = HoursFromWeekStart(weekStart, vvn.Etd);
            var unloadingHours = vvn.CargoUnloadManifest != null
                ? (int)Math.Ceiling((double)vvn.CargoUnloadManifest.CargoItems.Count / 25)
                : 0;
            var loadingHours = vvn.CargoLoadManifest != null
                ? (int)Math.Ceiling((double)vvn.CargoLoadManifest.CargoItems.Count / 25)
                : 0;

            facts.AppendLine($"vessel({SafeAtom(vvn.Vessel.Name)}, {arrival}, {depart}, {unloadingHours}, {loadingHours}, unassigned).");
        }

        var docks = visits
            .Where(v => v.Dock != null)
            .GroupBy(v => v.Dock!.Code)
            .Select(g => new { Code = g.Key, CraneCount = g.First().Dock!.Cranes?.Count ?? 1 })
            .ToList();

        foreach (var dock in docks)
        {
            facts.AppendLine($"dock({SafeAtom(dock.Code)}, {dock.CraneCount}).");
        }

        foreach (var s in allStaff)
        {
            var sAtom = $"s{s.MecanographicNumber}";
            foreach (var ow in s.OperationalWindows)
            {
                var (start, end) = ConvertOperationalWindowToWeekHours(weekStart, ow);
                facts.AppendLine($"staff_window({sAtom}, {start}, {end}).");
            }
        }

        var rebalancingFile = Path.Combine(env.ContentRootPath, "IARTI_Scheduling", "RebalanceDockAssignment.pl");
        if (!File.Exists(rebalancingFile))
            throw new FileNotFoundException($"Prolog rebalancing file not found: {rebalancingFile}");

        var tmpFactsFile = Path.Combine(Path.GetTempPath(), $"rebalance_facts_{Guid.NewGuid():N}.pl");
        await File.WriteAllTextAsync(tmpFactsFile, $":- ['{EscapePath(rebalancingFile)}'].\n" + facts);

        var outputBuilder = new StringBuilder();
        var errorBuilder = new StringBuilder();

        var dockList = string.Join(", ", docks.Select(d => $"({SafeAtom(d.Code)}, {d.CraneCount})"));

        using var proc = Process.Start(new ProcessStartInfo
        {
            FileName = "swipl",
            Arguments = $"-q -s \"{tmpFactsFile}\" -g \"rebalance_vessels([{dockList}], Assignments), write(Assignments), nl, halt.\"",
            RedirectStandardOutput = true,
            RedirectStandardError = true,
            UseShellExecute = false
        }) ?? throw new Exception("Prolog rebalancing failed to start!");

        proc.OutputDataReceived += (s, e) =>
        {
            if (e.Data != null)
                outputBuilder.AppendLine(e.Data);
        };

        proc.ErrorDataReceived += (s, e) =>
        {
            if (e.Data != null)
                errorBuilder.AppendLine(e.Data);
        };

        proc.BeginOutputReadLine();
        proc.BeginErrorReadLine();
        await proc.WaitForExitAsync();

        var stdout = outputBuilder.ToString();

        var vesselToDock = ParsePrologAssignments(stdout);

        return vesselToDock;
    }

    private static Dictionary<string, string> ParsePrologAssignments(string prologOutput)
    {
        var result = new Dictionary<string, string>();

        var cleaned = prologOutput.Trim().TrimStart('[').TrimEnd(']');

        var dockAssignments = cleaned.Split(["), ("], StringSplitOptions.RemoveEmptyEntries);

        foreach (var assignment in dockAssignments)
        {
            var trimmed = assignment.Trim('(', ')');

            var parts = trimmed.Split(',');

            if (parts.Length < 2) continue;

            var dockCode = parts[0].Trim();

            var vesselListStart = Array.FindIndex(parts, p => p.Contains('['));
            var vesselListEnd = Array.FindIndex(parts, p => p.Contains(']'));

            if (vesselListStart == -1 || vesselListEnd == -1) continue;

            var vesselsPart = string.Join(",", parts.Skip(vesselListStart).Take(vesselListEnd - vesselListStart + 1));
            vesselsPart = vesselsPart.Trim('[', ']', ' ');

            var vessels = vesselsPart.Split(',').Select(v => v.Trim()).Where(v => !string.IsNullOrEmpty(v));

            foreach (var vessel in vessels)
            {
                result[vessel] = dockCode;
            }
        }

        return result;
    }
}
