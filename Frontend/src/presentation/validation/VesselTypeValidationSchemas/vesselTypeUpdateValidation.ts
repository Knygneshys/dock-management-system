import * as Yup from "yup";

import {
  integerError,
  numberError,
  positiveNumberError,
  requiredError
} from "../../utils/errorUtils";

const capacity = "Capacity";
const maxRows = "Max Rows";
const maxBays = "Max Bays";
const maxTiers = "Max Tiers";
const length = "Length";
const draft = "Draft";

export const vesselTypeUpdateValidation = Yup.object({
  name: Yup.string().required(requiredError("Name")),
  description: Yup.string().required(requiredError("Description")),
  capacity: Yup.number()
    .typeError(numberError(capacity))
    .positive(positiveNumberError(capacity))
    .integer(integerError(capacity))
    .required(requiredError(capacity)),
  maxRows: Yup.number()
    .typeError(numberError(maxRows))
    .positive(positiveNumberError(maxRows))
    .integer(integerError(maxRows))
    .required(requiredError(maxRows)),
  maxBays: Yup.number()
    .typeError(numberError(maxBays))
    .positive(positiveNumberError(maxBays))
    .integer(integerError(maxBays))
    .required(requiredError(maxBays)),
  maxTiers: Yup.number()
    .typeError(numberError(maxTiers))
    .positive(positiveNumberError(maxTiers))
    .integer(integerError(maxTiers))
    .required(requiredError(maxTiers)),
  length: Yup.number()
    .typeError(numberError(length))
    .positive(positiveNumberError(length))
    .required(requiredError(length)),
  draft: Yup.number()
    .typeError(numberError(draft))
    .positive(positiveNumberError(draft))
    .required(requiredError(draft)),
});
