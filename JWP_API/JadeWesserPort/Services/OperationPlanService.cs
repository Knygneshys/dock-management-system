using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.DTOs.OperationPlanDTOs;
using JadeWesserPort.DTOs.PlannedOperationDTOs;
using JadeWesserPort.Services.Interfaces;

namespace JadeWesserPort.Services;

public class OperationPlanService(
    IStaffService staffService,
    IStaffRepository staffRepository,
    IResourceRepository resourceRepository
    ) : IOperationPlanService
{
    public async Task ValidateUpdateOperationPlanCommand(int vvnCode, UpdateOperationPlanCommand command)
    {
        var firstPlannedOperationInSequence = command.PlannedOperations.First();
        var lastPlannedOperationInSequence = command.PlannedOperations.Last();
        
        if (command.Start >= command.End)
        {
            throw new Exception("The start time must begin before the end time!");
        }

        if (!firstPlannedOperationInSequence.Start.Equals(command.Start))
        {
            throw new Exception("The earliest sequence should begin at the Operation Plan's start time!");
        }

        if (lastPlannedOperationInSequence.End > command.End)
        {
            throw new Exception(
                "The last planned operation of the sequence cannot end after the Operation Plan's end time!");
        }

        await ValidateStaffAndResourceAsync(command);
        ValidatePlannedOperationSequenceOrder(command.PlannedOperations);
    }

    private async Task ValidateStaffAndResourceAsync(UpdateOperationPlanCommand command)
    {
        var staffCode = command.StaffCodes[0];
        var resourceCode = command.CraneCodes[0];
        
        var staffMember = await staffRepository.GetByIdAsync(staffCode);
        var resource = await resourceRepository.FindByCodeAsync(resourceCode);

        if (staffMember is null)
        {
            throw new Exception($"Staff of number: {staffCode} does not exist!");
        }
        
        if (resource is null)
        {
            throw new Exception($"Resource of code: {resourceCode} does not exist!");
        }
        
        var staffMemberShifts = await staffService.GetStaffShiftsAsync(staffCode);
        if (staffMemberShifts is null || staffMemberShifts.Count().Equals(0))
        {
            throw new Exception($"{staffMember.Name} is not doing a shift from {command.Start} to {command.End}!");
        }

        var memberShifts = staffMemberShifts.ToArray();
        foreach (var shift in memberShifts)
        {
            var shiftStart = DateTime.Parse(shift.From);
            var shiftEnd = DateTime.Parse(shift.To);
            var isShiftStartOnTheSameDateAsThePlanStart = shiftStart.Date.Equals(command.Start.Date);
            if (isShiftStartOnTheSameDateAsThePlanStart)
            {
                var planStartsEarlierThanStaffMemberShift = command.Start < shiftStart;
                var planEndsLaterThanStaffMemberShift = command.End > shiftEnd;
                
                if (planStartsEarlierThanStaffMemberShift || planEndsLaterThanStaffMemberShift)
                {
                    throw new Exception($"{staffMember.Name} starts shift from {shift.From} to {shift.To}!");
                }
            }
        }
    }

    private void ValidatePlannedOperationSequenceOrder(List<PlannedOperationDto> plannedOperations)
    {
        foreach (var currentPlannedOperation in plannedOperations)
        {
            var plannedOperationStartsAfterItEnds = currentPlannedOperation.Start >= currentPlannedOperation.End;
            if (plannedOperationStartsAfterItEnds)
            {
                throw new Exception("The planned operation sequence is not in order!");
            }
        }
    }
}