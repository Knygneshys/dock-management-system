using JadeWesserPort.Domain.Entities;
using JadeWesserPort.Domain.Enums; 

namespace JWPTests.Providers;

public class StorageAreaProvider
{
    private Guid _id = Guid.NewGuid();
    private string _code = "STO-001";
    private StorageAreaType _type = StorageAreaType.Warehouse;
    private string _location = "North Sector";
    private int _maxCapacity = 5000;
    private int _currentOccupancy = 2000;

    public StorageArea Provide()
    {
        return new StorageArea
        {
            Id = _id,
            Code = _code,
            Type = _type,
            Location = _location,
            MaxCapacity = _maxCapacity,
            CurrentOccupancy = _currentOccupancy,
            Docks = new List<DockRecord>()
        };
    }
    
    public StorageAreaProvider WithCode(string code)
    {
        _code = code;
        return this;
    }

    public StorageAreaProvider WithType(StorageAreaType type)
    {
        _type = type;
        return this;
    }

    public StorageAreaProvider WithLocation(string location)
    {
        _location = location;
        return this;
    }

    public StorageAreaProvider WithCapacity(int max, int current)
    {
        _maxCapacity = max;
        _currentOccupancy = current;
        return this;
    }
}