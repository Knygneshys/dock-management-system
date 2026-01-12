export type CreateShiftCommand = {
    day: number,
    month: number,
    year: number,
    fromHour: number,
    fromMinute: number,
    toHour: number,
    toMinute: number,
    resourceCode: string,
}