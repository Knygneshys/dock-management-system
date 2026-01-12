using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Data.Repositories;
using JadeWesserPort.Domain;
using JadeWesserPort.DTOs.ShiftDTOs;
using JadeWesserPort.DTOs.StaffDTOs;
using JadeWesserPort.Extensions;
using JadeWesserPort.Utils;
using MapsterMapper;
using Microsoft.EntityFrameworkCore;

public class StaffService(
    IStaffRepository staffRepository,
    IMapper mapper,
    IQualificationRepository qualificationRepository,
    IResourceRepository resourceRepository,
    IShiftRepository shiftRepository) : IStaffService
{

    public async Task<StaffDTO> CreateAsyncService(StaffCreateDTO staffDto)
    {
        ValidateQualifications(staffDto.QualificationCodes);
        var staff = new StaffMember();

        mapper.Map(staffDto, staff);
        staff.Qualifications = await staffDto.DTOStringsToQualificationListAsync(qualificationRepository);

        await staffRepository.CreateAsync(staff);
        var ret = new StaffDTO();
        mapper.Map(staff, ret);

        return ret;
    }

    private static void ValidateQualifications(IEnumerable<string> qualificationCodes)
    {
        if (qualificationCodes is null || !qualificationCodes.Any())
        {
            throw new ArgumentException("Staff member must at least have one qualification");
        }
    }

    public async Task<IEnumerable<StaffDTO>> GetBySearchAsync(
        string? name, 
        int? mecanographicNumber,
        StaffStatus? status, 
        List<string>? qualificationsCodes, 
        string? operatorType)
    {
        operatorType ??= "contains";


        var query = staffRepository.GetAllQueryable();

        operatorType = operatorType.ToLower();

        if (!string.IsNullOrEmpty(name))
        {
            if (operatorType.Equals("equals"))
            {
                query = query.Where(q => q.Name.ToLower() == name.ToLower());
            }
            else
            {
                query = query.Where(q => q.Name.ToLower().Contains(name.ToLower()));
            }
        }

        if (mecanographicNumber.HasValue)
        {
            if (operatorType.Equals("equals"))
            {
                query = query.Where(q => q.MecanographicNumber == mecanographicNumber);
            }
            else
            {
                string toSMecanograohicNumber = mecanographicNumber.ToString();
                query = query.Where(q => q.MecanographicNumber.ToString().Contains(toSMecanograohicNumber));
            }
        }

        if (status.HasValue)
        {
            if (operatorType.Equals("equals"))
            {
                query = query.Where(q => q.Status == status);
            }
            else
            {
                string statusString = status.ToString();
                query = query.Where(q => q.Status.ToString().Contains(statusString));
            }
        }

        var staff = await query.ToListAsync();

        if (qualificationsCodes is not null && qualificationsCodes.Any())
        {
            staff = staff
                .Where(s => s.Qualifications.Any(q => qualificationsCodes.Contains(q.Code)))
                .ToList();
        }

        var result = mapper.Map<IEnumerable<StaffDTO>>(staff);

        return result;
    }

    public async Task<ShiftDto?> CreateShiftAsync(int staffMechNumber, ShiftCreateDto shiftCreateDto)
    { 
        Shift shift = new Shift();
        mapper.Map(shiftCreateDto, shift);
        
        if (DateTime.Compare(shift.From, shift.To) >= 0)
            throw new ArgumentException("from time has to be lower than To time!");
        shift.Resource = await shiftCreateDto.GetResourceIfAvailableFromDTOCode(shiftRepository, resourceRepository);
        shift.ResourceId = shift.Resource.Id;
        
        var staff = await staffRepository.GetByIdAsync(staffMechNumber);
        if (staff is null)
            throw new KeyNotFoundException($"Staff with id {staffMechNumber} not found!");

        var shiftFromDateTime = new DateTime(shiftCreateDto.Year, shiftCreateDto.Month, shiftCreateDto.Day, shiftCreateDto.FromHour, shiftCreateDto.FromMinute, 0);
        var shiftToDateTime = new DateTime(shiftCreateDto.Year, shiftCreateDto.Month, shiftCreateDto.Day, shiftCreateDto.ToHour, shiftCreateDto.ToMinute, 0);
        foreach (var stafShift in await shiftRepository.GetByStaffAsync(staff))
        {
            if (DateTimeUtils.Overlaps(stafShift.From, stafShift.To, shiftFromDateTime, shiftToDateTime))
            {
                throw new ArgumentException("Staff is occupied in time period selected");
            }
        }

        shift.StaffMember = staff;
        shift.StaffMemberId = staff.Id;

        var shiftWeekDay = shift.From.DayOfWeek;

        foreach (var operationalWindow in await staffRepository.GetStaffOperationalWindowsAsync(staffMechNumber))
        {
            if (operationalWindow.DayOfWeek.Equals(shiftWeekDay))
            {
                if(DateTimeUtils.T1InsideT2(TimeOnly.FromDateTime(shift.From), TimeOnly.FromDateTime(shift.To), operationalWindow.StartTime, operationalWindow.EndTime))
                {
                    await shiftRepository.CreateAsync(shift);
                    
                    var shiftDto = new ShiftDto();
                    mapper.Map(shift, shiftDto);
                    return shiftDto;
                }
            }
        }

        return null;
    }

    public async Task<IEnumerable<ShiftDto>?> GetStaffShiftsAsync(int staffMechNumber)
    {
        var staff = await staffRepository.GetByIdAsync(staffMechNumber);
        if (staff is null)
        {
            return null;
        }

        var shifts = await shiftRepository.GetByStaffAsync(staff);
        
        return mapper.Map<List<ShiftDto>>(shifts);
    }
    
    public async Task AddOperationalWindowAsync(
    int mNumber, 
    DayOfWeek dayOfWeek, 
    TimeOnly startTime, 
    TimeOnly endTime)
    {
        var staff = await staffRepository.GetByIdAsync(mNumber);
        
        if (staff == null)
            throw new KeyNotFoundException($"Staff with number {mNumber} not found");

        var newWindow = new OperationalWindow
        {
            Code = GenerateOperationalWindowCode(staff.MecanographicNumber, dayOfWeek),
            DayOfWeek = dayOfWeek,
            StartTime = startTime,
            EndTime = endTime,
            StaffMemberId = staff.Id
        };

        var overlappingWindows = staff.OperationalWindows
            .Where(ow => ow.DayOfWeek == dayOfWeek)
            .Where(ow => newWindow.OverlapsWith(ow))
            .ToList();

        if (overlappingWindows.Any())
        {
            throw new InvalidOperationException(
                $"Time range overlaps with existing operational windows for {dayOfWeek}");
        }

        staff.OperationalWindows.Add(newWindow);
        await staffRepository.SaveChangesAsync();
    }

    public async Task UpdateOperationalWindowAsync(
        int mNumber, 
        string operationalWindowCode,
        DayOfWeek dayOfWeek, 
        TimeOnly startTime, 
        TimeOnly endTime)
    {
        var staff = await staffRepository.GetByIdAsync(mNumber);
        
        if (staff == null)
            throw new KeyNotFoundException($"Staff with number {mNumber} not found");

        var operationalWindow = staff.OperationalWindows
            .FirstOrDefault(ow => ow.Code == operationalWindowCode);
        
        if (operationalWindow == null)
            throw new KeyNotFoundException("Operational window not found");

        var tempWindow = new OperationalWindow
        {
            Id = operationalWindow.Id,
            Code = operationalWindow.Code,
            DayOfWeek = dayOfWeek,
            StartTime = startTime,
            EndTime = endTime
        };

        var overlappingWindows = staff.OperationalWindows
            .Where(ow => ow.Code != operationalWindowCode)
            .Where(ow => ow.DayOfWeek == dayOfWeek)
            .Where(ow => tempWindow.OverlapsWith(ow))
            .ToList();

        if (overlappingWindows.Any())
        {
            throw new InvalidOperationException(
                $"Time range overlaps with existing operational windows for {dayOfWeek}");
        }

        operationalWindow.DayOfWeek = dayOfWeek;
        operationalWindow.StartTime = startTime;
        operationalWindow.EndTime = endTime;

        await staffRepository.SaveChangesAsync();
    }

    public async Task RemoveOperationalWindowAsync(int mNumber, string operationalWindowCode)
    {
        var staff = await staffRepository.GetByIdAsync(mNumber);
        
        if (staff == null)
            throw new KeyNotFoundException($"Staff with number {mNumber} not found");

        var operationalWindow = staff.OperationalWindows
            .FirstOrDefault(ow => ow.Code == operationalWindowCode);
        
        if (operationalWindow != null)
        {
            staff.OperationalWindows.Remove(operationalWindow);
            await staffRepository.SaveChangesAsync();
        }
    }
    
    private string GenerateOperationalWindowCode(int staffMNumber, DayOfWeek dayOfWeek)
    {
        var dayAbbr = dayOfWeek.ToString().Substring(0, 3).ToUpper();
        var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
        return $"{staffMNumber}-{dayAbbr}-{timestamp}";
    }
}