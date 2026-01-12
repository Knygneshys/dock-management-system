using JadeWesserPort.Domain.Entities;
using JadeWesserPort.Domain.System;
using JadeWesserPort.DTOs.ShippingAgentRepresentativeDTOs;

public class ShippingAgentRepresentativeProvider
{
    private string _name = "John Doe";
    private string _email = "john.doe@shipping.com";
    private string _companyCode = "COMP001";
    private Company _company = new Company { Code = "COMP001", Name = "Blue Ocean Shipping" };
    private User _user = new() { Email = "john.doe@shipping.com", Role=UserRole.ShippingAgentRepresentative };

    public ShippingAgentRepresentative Provide()
    {
        return new ShippingAgentRepresentative
        {
            Name = _name,
            Company = _company,
            CompanyId = _company.Id,
            User = _user ?? new User { Email = _email }
        };
    }

    public ShippingAgentRepresentativeDTO ProvideDto()
    {
        return new ShippingAgentRepresentativeDTO
        {
            Name = _name,
            Email = _email,
            CompanyCode = _companyCode
        };
    }

    public ShippingAgentRepresentativeProvider WithEmail(string email)
    {
        _email = email;
        if (_user is not null)
            _user.Email = email;
        return this;
    }

    public ShippingAgentRepresentativeProvider WithCompany(Company company)
    {
        _company = company;
        _companyCode = company.Code;
        return this;
    }

    public ShippingAgentRepresentativeProvider WithName(string name)
    {
        _name = name;
        return this;
    }

    public ShippingAgentRepresentativeProvider WithUser(User user)
    {
        _user = user;
        return this;
    }
}