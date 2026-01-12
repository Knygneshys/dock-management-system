export type CompTask = {
    code: string;
    categoryCode: string;
    vveCode: number;
    team: string;
    status: string;
    start: Date;
    end?: Date | undefined;
    impactOnOperations: boolean;
}