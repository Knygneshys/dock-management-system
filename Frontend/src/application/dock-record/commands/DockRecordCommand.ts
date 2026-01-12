export type DockRecordCommand = {
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