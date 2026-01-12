using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs.CompanyDTOs;

namespace JadeWesserPort.Data.Interfaces;

public interface ICompanyRepository
{
    Task<string> CreateAsync(Company company);
    Task<Company?> GetByCodeAsync(string code);

    Task<bool> ExistsAsync(string code);
    
    Task<List<Company>> GetAllAsync();
}