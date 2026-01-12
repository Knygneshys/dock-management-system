import type { CreateVesselCommand } from "../../application/vessel/commands/CreateVesselCommand";
import type { UpdateVesselCommand } from "../../application/vessel/commands/UpdateVesselCommand";
import type { VesselCreateDto } from "../dtos/vessel/vesselCreateDto";
import type { VesselUpdateDto } from "../dtos/vessel/vesselUpdateDto";

export function mapCreateVesselCommandToVesselCreateDto(command : CreateVesselCommand) : VesselCreateDto {
    return {
        imo: command.imo,
        name: command.name,
        typeCode: command.typeCode,
        ownerCode: command.ownerCode,
        operatorCode: command.operatorCode,
    }
}

export function mapUpdateVesselCommandToVesselUpdateDto(command : UpdateVesselCommand) : VesselUpdateDto {
    return {
        imo: command.imo,
        name: command.name,
        typeCode: command.typeCode,
        ownerCode: command.ownerCode,
        operatorCode: command.operatorCode,
    }
}