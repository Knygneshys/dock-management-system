using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Domain.System;
using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Data.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly JWPDbContext dbContext;

        public UserRepository(JWPDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<Guid> CreateAsync(User user)
        {
            await dbContext.Users.AddAsync(user);
            await dbContext.SaveChangesAsync();

            return user.Id;
        }

        public async Task<List<User>> GetAllAsync()
        {
            return await dbContext.Users.ToListAsync();
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            User? user = await dbContext.Users.FirstOrDefaultAsync(u => u.Email.Equals(email));
            return user;
        }

        public async Task<User?> GetByAuth0IdAsync(string auth0Id)
        {
            User? user = await dbContext.Users.FirstOrDefaultAsync(u => u.Auth0Id.Equals(auth0Id));
            return user;
        }
        public async Task<User?> GetByIdAsync(Guid id)
        {
            return await dbContext.Users
                .FirstOrDefaultAsync(u => u.Id == id);
        }
        
        public async Task UpdateAsync(User user)
        {
            dbContext.Users.Update(user);
            await dbContext.SaveChangesAsync();
        }

        public async Task<User?> GetByActivationTokenAsync(string token)
        {
            return await dbContext.Users
                .FirstOrDefaultAsync(u => u.ActivationToken == token);
        }

        public async Task SetHasReadPrivacyPolicyFlagsToFalse()
        {
            await dbContext.Users.ExecuteUpdateAsync(setters =>
                setters.SetProperty(user => user.HasReadPrivacyPolicy, false));
        }

        public async Task SetUserPrivacyPolicyFlagToTrue(string email)
        {
            await dbContext.Users
                .Where(user => user.Email.Equals(email))
                .ExecuteUpdateAsync(setters =>
                    setters.SetProperty(user => user.HasReadPrivacyPolicy, true));
        }

        public async Task DeleteAsync(Guid id)
        {
            var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (user != null)
            {
                dbContext.Users.Remove(user);
                await dbContext.SaveChangesAsync();
            }
        }
    }
}
