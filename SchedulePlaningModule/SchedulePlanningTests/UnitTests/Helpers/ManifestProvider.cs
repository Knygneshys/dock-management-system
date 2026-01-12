using SchedulePlanning.DTOs;

namespace SchedulePlanningTests.UnitTests.Helpers;

internal static class ManifestProvider
{
    private static readonly CargoItemDTO item = new();

    public static CargoManifestDTO ManifestWithTotakeNHours(int n)
    {
        var list = new List<CargoItemDTO>(n*25);
        for (int i = 0; i<n*25; i++)
        {
            list.Add(item);
        }
        return new CargoManifestDTO()
        {
            CargoItems = list,
        };
    }
}
