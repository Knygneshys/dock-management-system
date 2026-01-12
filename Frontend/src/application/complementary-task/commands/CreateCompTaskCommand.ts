export type CreateCompTaskCommand = {
    categoryCode: string;
    vveCode: number;
    team: string;
    status: string;
    start: Date;
    end?: Date;
    impactOnOperations: boolean;
}