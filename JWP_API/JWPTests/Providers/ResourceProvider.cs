using JadeWesserPort.Domain.Entities;
using JadeWesserPort.Domain.Entities.Resources;
using JadeWesserPort.Domain.Enums;

namespace JWPTests.Providers;
internal class ResourceProvider
{
    private string _alphanumericCode { get; set; } = "RES-001";
    private string _description { get; set; } = "Test Resource";
    private ResourceStatus _status { get; set; } = ResourceStatus.Active;
    private int _setupTimeMinutes { get; set; } = 30;
    private List<Qualification> _qualification { get; set; } = [];

    public ResourceProvider WithAlphanumericCode(string alphanumericCode)
    {
        _alphanumericCode = alphanumericCode;
        return this;
    }

    public ResourceProvider WithDescription(string description)
    {
        _description = description;
        return this;
    }

    public ResourceProvider WithStatus(ResourceStatus status)
    {
        _status = status;
        return this;
    }

    public ResourceProvider WithSetupTimeMinutes(int setupTimeMinutes)
    {
        _setupTimeMinutes = setupTimeMinutes;
        return this;
    }

    public ResourceProvider WithQualification(Qualification qualification)
    {
        _qualification.Add(qualification);
        return this;
    }

    public Resource Provide()
    {
        var r = new STSCrane
        {
            AlphanumericCode = _alphanumericCode,
            Description = _description,
            Status = _status,
            SetupTimeMinutes = _setupTimeMinutes,
            DockRecord = new DockRecordProvider().Provide()
        };
        r.Qualifications.AddRange(_qualification);
        return r;
    }

    public List<Resource> ProvideList()
    {
        var qualification = new QualificationProvider().Provide();
        return
        [
            WithAlphanumericCode("RES-001")
                .WithDescription("Test Resource 1")
                .WithStatus(ResourceStatus.Active)
                .WithSetupTimeMinutes(30)
                .WithQualification(qualification)
                .Provide(),
            WithAlphanumericCode("RES-002")
                .WithDescription("Test Resource 2")
                .WithStatus(ResourceStatus.Inactive)
                .WithSetupTimeMinutes(45)
                .WithQualification(qualification)
                .Provide(),
            WithAlphanumericCode("RES-003")
                .WithDescription("Test Resource 3")
                .WithStatus(ResourceStatus.Active)
                .WithSetupTimeMinutes(45)
                .WithQualification(qualification)
                .Provide()
            ];
    }
}
