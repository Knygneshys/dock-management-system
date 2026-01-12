using JadeWesserPort.Domain.System;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace JadeWesserPort.Data.Interfaces
{
    public interface IDataRectificationRequestRepository
    {
        Task CreateAsync(DataRectificationRequest request);
        Task<List<DataRectificationRequest>> GetPendingAsync();
        Task<DataRectificationRequest?> GetByIdAsync(Guid id);
        Task UpdateAsync(DataRectificationRequest request);
    }
}
