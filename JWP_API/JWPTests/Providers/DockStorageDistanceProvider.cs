using JadeWesserPort.Domain.Entities;

namespace JWPTests.Providers
{
    public class DockStorageDistanceProvider
    {
        private string _code = "DIST-001";
        private double _distance = 250.5;
        private string? _notes = "Initial test distance";

        private DockRecord _dock = new DockRecordProvider().Provide();
        private StorageArea _storage = new StorageAreaProvider().Provide();

        public DockStorageDistance Provide()
        {
            return new DockStorageDistance
            {
                Id = Guid.NewGuid(),
                Code = _code,
                DockRecordId = _dock.Id,
                DockRecord = _dock,
                StorageAreaId = _storage.Id,
                StorageArea = _storage,
                DistanceMeters = _distance,
                Notes = _notes
            };
        }

        public DockStorageDistanceProvider WithCode(string code)
        {
            _code = code;
            return this;
        }

        public DockStorageDistanceProvider WithDistance(double distance)
        {
            _distance = distance;
            return this;
        }

        public DockStorageDistanceProvider WithNotes(string? notes)
        {
            _notes = notes;
            return this;
        }
    }
}