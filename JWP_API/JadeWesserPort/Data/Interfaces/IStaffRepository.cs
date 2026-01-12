using JadeWesserPort.Domain;

namespace JadeWesserPort.Data.Interfaces;

public interface IStaffRepository
{
    public Task<int> CreateAsync(StaffMember staffMember);
    public Task<StaffMember?> GetByIdAsync(int id);
    public Task<List<StaffMember>> GetAllAsync();
    public Task<List<OperationalWindow>> GetStaffOperationalWindowsAsync(int mNumber);
    public IQueryable<StaffMember> GetAllQueryable();
    public Task SaveChangesAsync();
}