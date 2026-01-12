using JadeWesserPort.DTOs.OperationPlanDTOs;

namespace JadeWesserPort.Services.Interfaces;

public interface IOperationPlanService
{
    Task ValidateUpdateOperationPlanCommand(int vvnCode, UpdateOperationPlanCommand command);
}