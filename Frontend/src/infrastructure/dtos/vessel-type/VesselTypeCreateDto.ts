export type VesselTypeCreateDto = {
    code: string,
    name: string,
    description: string,
    capacity: number,
    maxRows: number,
    maxBays: number,
    maxTiers: number,
    length: number,
    draft: number,
}