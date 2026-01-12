using JadeWesserPort.Domain.System;
using JadeWesserPort.DTOs;

namespace JWPTests.Providers
{
    internal class UserProvider
    {
        private string auth0Id = "auth0|test";
        private string _email { get; set; } = "email@email.com";
        private UserRole _role { get; set; } = UserRole.PortAuthorityOfficer;

        public UserProvider WithAuth0Id(string id)
        {
            auth0Id = id;
            return this;
        }

        public UserProvider WithEmail(string email)
        {
            _email = email;
            return this;
        }

        public UserProvider WithRole(UserRole role)
        {
            _role = role;
            return this;
        }

        public User Provide()
        {
            return new User()
            {
                Auth0Id = auth0Id,
                Email = _email,
                Role = _role
            };
        }

        public UserDTO ProvideDTO()
        {
            return new UserDTO()
            {
                Email = _email,
                Role = _role
            };
        }

        public List<User> ProvideList()
        {
            return [
                WithAuth0Id("auth0|001").Provide(),
                WithAuth0Id("auth0|002").Provide(),
                WithAuth0Id("auth0|003").Provide()
                ];
        }
    }
}
