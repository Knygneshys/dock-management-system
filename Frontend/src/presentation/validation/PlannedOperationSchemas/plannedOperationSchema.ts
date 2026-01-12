import * as yup from "yup";
import { PlannedOperation } from "../../../domain/Types/entities/PlannedOperation";
import { plannedOperationFormatedDateDto } from "../../../infrastructure/dtos/planned-operation/plannedOperationFormatedDateDto";

const containerPositionSchema = yup
  .object({
    bay: yup.number().required(),
    row: yup.number().required(),
    tier: yup.number().required(),
  })
  .required();

export const plannedOperationSchema: yup.ObjectSchema<plannedOperationFormatedDateDto> =
  yup.object({
    start: yup.date().required(),
    end: yup.date().required(),
    from: containerPositionSchema,
    to: containerPositionSchema,
    containerId: yup.string().required(),
  });
