import { Inject, Service } from "typedi";
import ICompTaskRepo from "../../../domain/IRepos/ICompTaskRepo";
import { Model } from "mongoose";
import { ICompTaskPersistence } from "../../../use-cases/dataschema/ICompTaskPersistence";
import { ComplementaryTask } from "../../../domain/entities/ComplementaryTask";
import { GenericCode } from "../../../domain/object-values/genericCode";
import { CompTaskMap } from "../../../use-cases/mappers/CompTaskMap";
import { VVNCode } from "../../../domain/object-values/vvnCode";

@Service()
export default class compTaskRepo implements ICompTaskRepo{
    constructor(@Inject('compTaskSchema') private ctSchema: Model<ICompTaskPersistence & Document>) {}

  public async findByDomainCode(code: GenericCode): Promise<ComplementaryTask | null> {
    const query = { code: code.value };
    const ctRecord = await this.ctSchema.findOne(query);

    if (!ctRecord) {
    return null;
    }

    const ctResult = CompTaskMap.toDomain(ctRecord);
    if (ctResult.isFailure) {
    const errorValue = ctResult.errorValue();

    if (typeof errorValue === 'string') {
        throw new Error(errorValue);
    }

    throw new Error('CompTask mapping error: ' + JSON.stringify(errorValue));
    }

    return ctResult.getValue()!;
  }

  public async getAllCompTasksByVve(vveCode: VVNCode): Promise<ComplementaryTask[]> {
    const query = { vveCode: vveCode.value };
    const ctRecords = await this.ctSchema.find(query);
    
    if (!ctRecords || ctRecords.length === 0) {
        return [];
    }

    const tasks: ComplementaryTask[] = [];
    for (const record of ctRecords) {
        const ctResult = CompTaskMap.toDomain(record);

        if (ctResult.isFailure) {
            const errorValue = ctResult.errorValue();
            if (typeof errorValue === 'string') {
                throw new Error(errorValue);
            }
            throw new Error('CompTask mapping error: ' + JSON.stringify(errorValue));
        }
        
        tasks.push(ctResult.getValue()!);
    }
    
    return tasks;
}

public async getAllCompTasks(): Promise<ComplementaryTask[]> {
    const ctRecords = await this.ctSchema.find({});

    if (!ctRecords || ctRecords.length === 0) {
        return [];
    }
    
    const tasks: ComplementaryTask[] = [];
    for (const record of ctRecords) {
        const ctResult = CompTaskMap.toDomain(record);
        
        if (ctResult.isFailure) {
            const errorValue = ctResult.errorValue();
            if (typeof errorValue === 'string') {
                throw new Error(errorValue);
            }
            throw new Error('CompTask mapping error: ' + JSON.stringify(errorValue));
        }
        
        tasks.push(ctResult.getValue()!);
    }
    
    return tasks;
}

public async search(start?: Date, end?: Date, status?: string): Promise<ComplementaryTask[]> {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};

   if (start && end) {
        query.start = { $gte: start, $lte: end };
    } else if (start) {
        query.start = { $gte: start };
    } else if (end) {
        query.start = { $lte: end };
    }
    
    if (status) {
        query.status = status;
    }
    
    const ctRecords = await this.ctSchema.find(query);
    
    if (!ctRecords || ctRecords.length === 0) {
        return [];
    }
    
    const tasks: ComplementaryTask[] = [];
    for (const record of ctRecords) {
        const ctResult = CompTaskMap.toDomain(record);
        
        if (ctResult.isFailure) {
            const errorValue = ctResult.errorValue();
            if (typeof errorValue === 'string') {
                throw new Error(errorValue);
            }
            throw new Error('CompTask mapping error: ' + JSON.stringify(errorValue));
        }
        
        tasks.push(ctResult.getValue()!);
    }
    
    return tasks;
}

public async save(compTask: ComplementaryTask): Promise<ComplementaryTask> {
    const rawTask = CompTaskMap.toPersistence(compTask);

    const existingTask = await this.ctSchema.findOne({ code: rawTask.code });
    
    if (existingTask) {
        await this.ctSchema.findOneAndUpdate(
            { code: rawTask.code },
            { $set: rawTask },
            { new: true }
        );
    } else {
        const newTask = new this.ctSchema(rawTask);
        await newTask.save();
    }

    return compTask;
}

public async exists(compTask: ComplementaryTask): Promise<boolean> {

    const query = { code: compTask.code.value };
    const result = await this.ctSchema.findOne(query);
    return result !== null;
}
    
}