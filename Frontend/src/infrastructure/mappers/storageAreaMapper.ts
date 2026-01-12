import type { CreateStorageAreaCommand } from "../../application/storage-area/commands/CreateStorageAreaCommand";
import type { UpdateStorageAreaCommand } from "../../application/storage-area/commands/UpdateStorageAreaCommand";

export function mapCreateStAreaCommandToStorageAreaCreationDto (command: CreateStorageAreaCommand){
    return{
        code: command.code,
        type: command.type,
        location: command.location,
        maxCapacity: command.maxCapacity,
        currentOccupancy: command.currentOccupancy,
        width: command.width,
        height: command.height,
        depth: command.depth,
        x: command.x,
        y: command.y,
        z: command.z,
    }
};

export function mapUpdateStAreaCommandToStorageAreaUpdateDto (command: UpdateStorageAreaCommand) {
    return {
        type: command.type,
        location: command.location,
        maxCapacity: command.maxCapacity,
        currentOccupancy: command.currentOccupancy,
        width: command.width,
        height: command.height,
        depth: command.depth,
        x: command.x,
        y: command.y,
        z: command.z,
    }
}