import type { VesselType } from "../Types/entities/VesselType";
import type { VesselTypeSearchQuery } from "../../application/vessel-type/queries/VesselTypeSearchQuery";

export interface IVesselTypeRepository {
  getAll(): Promise<VesselType[]>;

  create(vesselTypeModel: VesselType): Promise<string | null>;

  update(code: string, vesselTypeModel: VesselType): Promise<VesselType | null>;

  getById(code: string): Promise<VesselType | null>;

  getBySearch(searchQuery: VesselTypeSearchQuery): Promise<VesselType[]>;
}
