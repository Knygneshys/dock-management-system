import type { Company } from "./Company"
import type { VesselType } from "./VesselType"

export type Vessel = {
    imo: string,
    name: string,
    type: VesselType,
    operator: Company,
    owner: Company,
}