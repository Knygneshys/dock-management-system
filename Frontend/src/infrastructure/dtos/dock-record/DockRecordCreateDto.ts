export type DockRecordCreateDto = {
    name: string,
    location: string,
    length: number,
    depth: number,
    maxDraft: number,
    x: number,
    y: number,
    z: number,
    vesselTypeCodes: string[],
}