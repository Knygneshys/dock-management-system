import * as Yup from "yup";

import { integerError, numberError, positiveNumberError, requiredError } from "../../utils/errorUtils";

const length = "Length";
const depth = "Depth";
const maxDraft = "Max Draft";

export const dockRecordCreationValidation = Yup.object({
  name: Yup.string().required(requiredError("Name")),
  location: Yup.string().required(requiredError("Location")),
  length: Yup.number()
    .typeError(numberError(length))
    .positive(positiveNumberError(length))
    .integer(integerError(length))
    .required(requiredError(length)),
  depth: Yup.number()
    .typeError(numberError(depth))
    .positive(positiveNumberError(depth))
    .integer(integerError(depth))
    .required(requiredError(depth)),
  maxDraft: Yup.number()
    .typeError(numberError(maxDraft))
    .positive(positiveNumberError(maxDraft))
    .integer(integerError(maxDraft))
    .required(requiredError(maxDraft)),
  x: Yup.number().typeError(numberError("X Position")).required(requiredError("X Position")),
  y: Yup.number().typeError(numberError("Y Position")).required(requiredError("Y Position")),
  z: Yup.number().typeError(numberError("Z Position")).required(requiredError("Z Position")),
  vesselTypeCodes: Yup.array(),
});
