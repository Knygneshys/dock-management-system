using System.Collections.Generic;
using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Domain;
using JadeWesserPort.DTOs.QualificationDTOs;
using JadeWesserPort.Services.Interfaces;
using MapsterMapper;
using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Services;

public class QualificationService(IQualificationRepository qualificationRepository, IMapper mapper)
    : IQualificationService
{
    public async Task<IEnumerable<QualificationDTO>> GetBySearchAsync(string? name, string? code, string? operatorType)
    {
        operatorType ??= "contains";

        var query =  qualificationRepository.GetAllQueryable();
        
        operatorType.ToLower();

        if (!string.IsNullOrEmpty(name))
        {
            if (operatorType.Equals("equals"))
            {
                query = query.Where(q => q.Name.ToUpper() == name.ToUpper());
            }
            else
            {
                query = query.Where(q => q.Name.ToUpper().Contains(name.ToUpper()));
            }
        }
        if (!string.IsNullOrEmpty(code))
        {
            if (operatorType.Equals("equals"))
            {
                query = query.Where(q => q.Code.ToUpper() == code.ToUpper());
            }
            else
            {
                query = query.Where(q => q.Code.ToUpper().Contains(code.ToUpper()));
            }
        }
        
        var qualifications = await query.ToListAsync();
        var result = mapper.Map<IEnumerable<QualificationDTO>>(qualifications);

        return result;
    }
}

