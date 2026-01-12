import type { VesselType } from "../../domain/Types/entities/VesselType";
import type { VesselTypeCreateDto } from "../dtos/vessel-type/VesselTypeCreateDto";
import type { VesselTypeUpdateDto } from "../dtos/vessel-type/VesselTypeUpdateDto";

export function mapVesselTypeToVesselTypeDto(
  vesselType: VesselType
): VesselType {
  return {
    code: vesselType.code,
    name: vesselType.name,
    description: vesselType.description,
    capacity: vesselType.capacity,
    maxRows: vesselType.maxRows,
    maxBays: vesselType.maxBays,
    maxTiers: vesselType.maxTiers,
    length: vesselType.length,
    draft: vesselType.draft,
  };
}

export function mapVesselTypeToVesselTypeUpdateDto(
  vesselType: VesselType
): VesselTypeUpdateDto {
  return {
    name: vesselType.name,
    description: vesselType.description,
    capacity: vesselType.capacity,
    maxRows: vesselType.maxRows,
    maxBays: vesselType.maxBays,
    maxTiers: vesselType.maxTiers,
    length: vesselType.length,
    draft: vesselType.draft,
  };
}

export function mapVesselTypeToVesselTypeCreateDto(
  vesselType: VesselType
): VesselTypeCreateDto {
  return {
    code: vesselType.code,
    name: vesselType.name,
    description: vesselType.description,
    capacity: vesselType.capacity,
    maxRows: vesselType.maxRows,
    maxBays: vesselType.maxBays,
    maxTiers: vesselType.maxTiers,
    length: vesselType.length,
    draft: vesselType.draft,
  };
}
