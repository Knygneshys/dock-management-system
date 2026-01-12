using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Domain.Entities;
using JadeWesserPort.Domain.Entities.ValueObjects;
using JadeWesserPort.DTOs.DailyScheduleDTOs;
using JadeWesserPort.Services.Interfaces;

namespace JadeWesserPort.Services;

public class SchedulingService(IVVNService vvnService, IStorageAreaRepository storageAreaRepository) : ISchedulingService
{
    public async Task<DailyScheduleResponseDto> ScheduleOperationSequenceAsync(DailyScheduleResponseDto schedule)
    {
        if (schedule.Items is null)
        {
            return schedule;
        }

        for (int i = 0; i < schedule.Items.Count; i++)
        {
            schedule.Items[i] = await GenerateSequenceAsync(schedule.Date , schedule.Items[i]);
        }

        return schedule;
    }

    private async Task<DailyScheduleItemDto> GenerateSequenceAsync(DateOnly date, DailyScheduleItemDto item)
    {
        List<PlannedOperation> plannedOperations = [];
        List<CargoItem> cargoItems;
        var random = new Random();
        
        var vesselVisitNotification = await vvnService.GetVvnByCodeOnDate(date, item.VVNCode);
        
        if (vesselVisitNotification is null)
        {
            return item;
        }

        if (vesselVisitNotification.CargoUnloadManifest is not null)
        {
            cargoItems = vesselVisitNotification.CargoUnloadManifest.CargoItems;
        }
        else if(vesselVisitNotification.CargoLoadManifest is not null)
        {
            cargoItems = vesselVisitNotification.CargoLoadManifest.CargoItems;
        }
        else
        {
            return item;
        }
        
        float operationStart = item.Start*60;
        const float operationCompletionTimeInMinutes = 2.4f;
        var storageArea = storageAreaRepository.GetAllQueryable().FirstOrDefault();
        
        if (storageArea is null)
        {
            return item;
        }
        
        foreach (var cargoItem in cargoItems)
        {
            var plannedOperation = new PlannedOperation()
            {
                ContainerId = cargoItem.ContainerISO,
                Start = operationStart,
                End = operationStart + operationCompletionTimeInMinutes,
                From = cargoItem.VesselContainerPosition,
                To = new ContainerPosition()
                {
                    Bay = random.Next(0, 21),
                    Row = random.Next(0, 21),
                    Tier = random.Next(0, 21),
                },
            };
            
            plannedOperations.Add(plannedOperation);
            operationStart += operationCompletionTimeInMinutes;
        }

        item.StorageAreaCode = storageArea.Code;
        item.PlannedOperations = plannedOperations;
        
        return item;
    }
}