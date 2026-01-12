using JadeWesserPort.Domain;
using JadeWesserPort.DTOs.ShiftDTOs;
using JadeWesserPort.DTOs.StaffDTOs;

namespace JadeWesserPort.Data.Interfaces;

public interface IStaffService
{
    Task<IEnumerable<StaffDTO>> GetBySearchAsync(
        string? name, 
        int? mecanographicNumber,
        StaffStatus? status, 
        List<string>? qualificationsCodes, 
        string? operatorType
    );
    
    Task<StaffDTO> CreateAsyncService(StaffCreateDTO staff);

    Task<ShiftDto?> CreateShiftAsync(int staffMechNumber, ShiftCreateDto shiftCreateDto);

    Task<IEnumerable<ShiftDto>?> GetStaffShiftsAsync(int staffMechNumber);
    Task AddOperationalWindowAsync(int mNumber, DayOfWeek dayOfWeek, TimeOnly startTime, TimeOnly endTime);
    Task UpdateOperationalWindowAsync(int mNumber, string operationalWindowCode, DayOfWeek dayOfWeek, TimeOnly startTime, TimeOnly endTime);
    Task RemoveOperationalWindowAsync(int mNumber, string operationalWindowCode);
}