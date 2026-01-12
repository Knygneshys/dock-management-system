using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs.QualificationDTOs;
using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Data.Repositories;

public class QualificationRepository(JWPDbContext context) : IQualificationRepository
{
    public async Task<string> CreateAsync(Qualification qualification)
    {
        if (await context.Qualifications.AnyAsync(q => q.Code == qualification.Code))
        {
            throw new InvalidOperationException($"A qualification with code '{qualification.Code}' already exists.");
        }
        
        await context.Qualifications.AddAsync(qualification);
        await context.SaveChangesAsync();
        
        return qualification.Code;
    }

    public async Task<bool> UpdateAsync(string code, UpdateQualificationDTO qualification)
    {
        var existing = await context.Qualifications.FirstOrDefaultAsync(q => q.Code == code);
        if (existing is null)
        {
            return false;
        }

        existing.Name = qualification.Name;
        existing.UpdatedAt = DateTime.UtcNow;
        
        await context.SaveChangesAsync();
        return true;
    }

    public async Task<List<Qualification>> GetAllAsync()
    {
        var list = await context.Qualifications.ToListAsync();
        return list;
    }

    public IQueryable<Qualification> GetAllQueryable()
    {
        return context.Qualifications.AsQueryable();
    }

    public async Task<bool> ExistsByCodeAsync(string code)
    {
        return await context.Qualifications.AnyAsync(q => q.Code == code);
    }

    public async Task<Qualification> GetByCodeAsync(string code)
    {
        return await context.Qualifications
            .FirstOrDefaultAsync(q => q.Code.ToUpper() == code.ToUpper());
    }
}