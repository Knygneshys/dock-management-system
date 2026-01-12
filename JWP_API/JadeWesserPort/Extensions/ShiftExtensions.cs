using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs.ShiftDTOs;
using JadeWesserPort.Utils;

namespace JadeWesserPort.Extensions;

public static class ShiftExtensions
{
    public static async Task<Resource> GetResourceIfAvailableFromDTOCode(
        this ShiftCreateDto dto, 
        IShiftRepository shiftRepository, 
        IResourceRepository resourceRepository)
    {
        var resource = await resourceRepository.FindByCodeAsync(dto.ResourceCode);
        if (resource is null)
            throw new KeyNotFoundException($"Resource with code {dto.ResourceCode} not found.");
        var resourceShifts = await shiftRepository.GetByResourceAsync(resource);
        var shiftFromDateTime = new DateTime(dto.Year, dto.Month, dto.Day, dto.FromHour, dto.FromMinute, 0);
        var shiftToDateTime = new DateTime(dto.Year, dto.Month, dto.Day, dto.ToHour, dto.ToMinute, 0);
        foreach (var shift in resourceShifts)
        {
            if(DateTimeUtils.Overlaps(shift.From, shift.To, shiftFromDateTime, shiftToDateTime))
            {
                throw new ArgumentException("Selected Resource is occupied in time period selected");
            }
        }

        return resource;
    }
}
