import * as Yup from "yup";

import { integerError, numberError, positiveNumberError, requiredError } from "../../utils/errorUtils";

export const compTaskCategoryCreationValidation = Yup.object({
  name: Yup.string().required(requiredError("Name")),
  description: Yup.string().required(requiredError("Description")),
  defaultDelayHour: Yup.number()
    .integer(integerError("Hour"))
    .min(0, positiveNumberError("Hour"))
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value)),

  defaultDelayMinute: Yup.number()
    .integer(integerError("Minute"))
    .min(0, positiveNumberError("Minute"))
    .max(59, numberError("Minute"))
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
});
