using SchedulePlanning.DTOs;
using SchedulePlanning.Enums;

namespace SchedulePlanning.Services.Interfaces;
public interface IAlgorithmRunnerService
{
    Task<DailyScheduleResponseDto> RunGeneticSingleCraneAlgAsync(
        DateOnly date, 
        List<VVNDto> validVisits,
        List<StaffDto> validStaffs);
    Task<DailyScheduleResponseDto> RunGeneticMultiCraneAlgAsync(
        DateOnly date,
        List<VVNDto> validVisits,
        List<StaffDto> validStaffs);
    Task<DailyScheduleResponseDto> RunSingleCraneAlgAsync(
        DateOnly date, 
        AlgorithmType algorithmType, 
        List<VVNDto> validVisits, 
        List<StaffDto> validStaffs);
    Task<DailyScheduleResponseDto> RunMultiCraneAlgAsync(
        DateOnly date, 
        AlgorithmType algorithmType, 
        List<VVNDto> validVisits, 
        List<StaffDto> validStaffs);
    Task<Dictionary<string, string>> RunPrologRebalancing(
        DateOnly date,
        List<VVNDto> visits,
        List<StaffDto> allStaff);
}

