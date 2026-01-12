export interface ICompTaskPersistence {
    id: string,
    code: string;
    categoryCode: string;
    vveCode: number;
    team: string;
    status: string;
    start: Date;
    end?: Date;
    impactOnOperations: boolean;
}