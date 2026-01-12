using SchedulePlanning.DTOs;

namespace SchedulePlanningTests.UnitTests.Helpers;

internal static class VVNProvider
{
    public static VVNDto ProvideFullDTO(int code, DockRecordDto dock, DateTime eta, DateTime etd, int? unloadHours, int? loadHours)
    {
        return new VVNDto()
        {
            Code = code,
            Dock = dock,
            Eta = eta,
            Etd = etd,
            CargoLoadManifest = loadHours.HasValue ? ManifestProvider.ManifestWithTotakeNHours(loadHours.Value) : null,
            CargoUnloadManifest = unloadHours.HasValue ? ManifestProvider.ManifestWithTotakeNHours(unloadHours.Value) : null
        };
    }
}
