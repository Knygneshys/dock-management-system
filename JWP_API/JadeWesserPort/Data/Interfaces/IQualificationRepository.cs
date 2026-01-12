using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs.QualificationDTOs;

namespace JadeWesserPort.Data.Interfaces;

public interface IQualificationRepository
{
    Task<string> CreateAsync(Qualification qualification);
    Task<bool>  UpdateAsync(string code, UpdateQualificationDTO qualification);
    Task<List<Qualification>> GetAllAsync();
    IQueryable<Qualification> GetAllQueryable();
    Task<bool> ExistsByCodeAsync(string code);
    Task<Qualification> GetByCodeAsync(string code);
}