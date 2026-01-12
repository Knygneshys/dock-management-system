export type ResourceCreateDto = {
    alphanumericCode: string,
    description: string,
    setupTimeMinutes: number,
    qualifications: string[],
    resourceType: string,
    status: string,
    dockRecordCode: string,
    storageAreaCode: string,
}