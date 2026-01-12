import type { DockRecordCommand } from "../../application/dock-record/commands/DockRecordCommand";

export function mapDockRecordCommandToDto(command: DockRecordCommand){
    return{
        name: command.name,
        location: command.location,
        length: command.length,
        depth: command.depth,
        maxDraft: command.maxDraft,
        x: command.x,
        y: command.y,
        z: command.z,
        vesselTypeCodes: command.vesselTypeCodes,
    }
}