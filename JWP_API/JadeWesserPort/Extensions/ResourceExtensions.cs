using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs.ResourceDTOs;

namespace JadeWesserPort.Extensions;
public static class ResourceExtensions
{
    public static async Task<List<Qualification>> DTOStringsToQualificationList(this ResourceCreateDTO dto, IQualificationRepository qualificationRepository)
    {
        var qualifications = await qualificationRepository.GetAllAsync();
        var result = new List<Qualification>();
        foreach (var qInDto in dto.Qualifications)
        {
            var qualification = qualifications.FirstOrDefault(q => q.Code.Equals(qInDto));
            if (qualification is not null)
            {
                result.Add(qualification);
            }
            else
            {
                throw new InvalidOperationException($"Qualification with code {qInDto} does not exist.");
            }
        }

        return result;
    }

    public static async Task<DockRecord> DTODockCodeToDockRecordAsync(this ResourceCreateDTO dto, IDockRecordRepository dockRecordRepository)
    {
        if(dto.DockRecordCode is null)
        {
            throw new ArgumentException("Dock R2cord code missing!");
        }
        var dock = await dockRecordRepository.FindByCodeAsync(dto.DockRecordCode) ?? throw new KeyNotFoundException($"Dock with code {dto.DockRecordCode} not found!");

        return dock;
    }

    public static async Task<StorageArea> DTOStorageAreaCodeToStorageAreaAsync(this ResourceCreateDTO dto, IStorageAreaRepository storageAreaRepository)
    {
        if (dto.StorageAreaCode is null)
        {
            throw new ArgumentException("Storage Area code missing!");
        }
        var sArea = await storageAreaRepository.FindByCodeAsync(dto.StorageAreaCode) ?? throw new KeyNotFoundException($"Storage area with code {dto.StorageAreaCode} not found!");

        return sArea;
    }

    public static Resource ToResource(this ResourceUpdateDTO dto, List<Qualification> qualifications, Resource resource)
    {
        resource.Description = dto.Description;
        resource.Status = dto.Status;
        resource.SetupTimeMinutes = dto.SetupTimeMinutes;
        resource.Qualifications.Clear();
        foreach (var qInDto in dto.Qualifications)
        {
            var qualification = qualifications.FirstOrDefault(q => q.Code.Equals(qInDto));
            if (qualification is not null)
            {
                resource.Qualifications.Add(qualification);
            }
            else
            {
                throw new InvalidOperationException($"Qualification with code {qInDto} does not exist.");
            }
        }
        return resource;
    }
}
