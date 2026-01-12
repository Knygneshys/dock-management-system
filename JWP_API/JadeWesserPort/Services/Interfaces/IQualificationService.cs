using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs.QualificationDTOs;

namespace JadeWesserPort.Services.Interfaces;

public interface IQualificationService
{ 
    public Task<IEnumerable<QualificationDTO>> GetBySearchAsync(string? name, string? code, string? contentType);
}