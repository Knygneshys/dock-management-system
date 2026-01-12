import type { OWCommand } from "../../application/operational-window/commands/OWCommand";

export interface IOWRepository {    
    create(mNumber:number, command: OWCommand): Promise<void>;

    update(mNumber: number, code:string, command: OWCommand): Promise<void>;

    delete(mNumber: number, code: string): Promise<void>;
}