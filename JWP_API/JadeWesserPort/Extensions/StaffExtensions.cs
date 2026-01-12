using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs.StaffDTOs;

namespace JadeWesserPort.Extensions;

public static class StaffExtensions
{
    public static async Task<List<Qualification>> DTOStringsToQualificationListAsync(this StaffCreateDTO dto, IQualificationRepository qualificationRepository)
    {
        var qualifications = await qualificationRepository.GetAllAsync();
        var result = new List<Qualification>();
        foreach (var qInDto in dto.QualificationCodes)
        {
            var qualification = qualifications.FirstOrDefault(q => q.Code.Equals(qInDto));
            if (qualification is not null)
            {
                result.Add(qualification);
            }
            else
            {
                throw new KeyNotFoundException($"Qualification with code {qInDto} does not exist.");
            }
        }

        return result;
    }
    
    public static async Task<List<Qualification>> DTOStringsToQualificationListUpdateAsync(
        this StaffUpdateDTO dto, 
        IQualificationRepository qualificationRepository)
    {
        var qualifications = new List<Qualification>();
    
        if (dto.QualificationCodes == null || !dto.QualificationCodes.Any())
            return qualifications;

        foreach (var code in dto.QualificationCodes)
        {
            var qualification = await qualificationRepository.GetByCodeAsync(code);
            if (qualification != null)
            {
                qualifications.Add(qualification);
            }
        }
    
        return qualifications;
    }
}
