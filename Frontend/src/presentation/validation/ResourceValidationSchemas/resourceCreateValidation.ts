/* eslint-disable max-len */
import * as Yup from "yup";

import { integerError, numberError, positiveNumberError, requiredError } from "../../utils/errorUtils";
import { resourceType } from "../../../domain/Enums/resourceType";
import { resourceStatus } from "../../../domain/Enums/resourceStatus";

const setupTimeMinutes = "Setup Time";

export const resourceCreateValidation = Yup.object({
  alphanumericCode: Yup.string().required(requiredError("Code")),
  description: Yup.string().required(requiredError("Description")),
  resourceType: Yup.mixed()
    .oneOf([resourceType.STS_CRANE, resourceType.TERMINAL_TRUCK, resourceType.YARD_CRANE])
    .required(requiredError("Type")),
  status: Yup.mixed()
    .oneOf([resourceStatus.ACTIVE, resourceStatus.INACTIVE, resourceStatus.MAINTENENCE])
    .required(requiredError("Status")),
  qualifications: Yup.array().of(Yup.string()),
  setupTimeMinutes: Yup.number()
    .typeError(numberError(setupTimeMinutes))
    .positive(positiveNumberError(setupTimeMinutes))
    .integer(integerError(setupTimeMinutes))
    .required(requiredError(setupTimeMinutes))
});
