import type { OWCommand } from "../../application/operational-window/commands/OWCommand";
import type { IOWRepository } from "../../domain/interfaces/IOWRepository";
import { createOperationalWindow, deleteOperationalWindow, updateOperationalWindow } from "../api/clients/staffMemberApi";
import { mapOWCommandToOWFormDto } from "../mappers/owMapper";

export const ExternalApiOWRepository : IOWRepository = {
    create: async function (mNumber: number, command: OWCommand): Promise<void>{
        const dto = mapOWCommandToOWFormDto(command);

        await createOperationalWindow(mNumber, dto);
    },

    update: async function (mNumber: number, code: string, command: OWCommand): Promise<void>{
        const dto = mapOWCommandToOWFormDto(command);

        await updateOperationalWindow(mNumber, code, dto);
    },

    delete: async function (mNumber: number, code: string): Promise<void>{
        await deleteOperationalWindow(mNumber, code);
    }
}