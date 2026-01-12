import * as Yup from "yup";
import {
  integerError,
  numberError,
  positiveNumberError,
  requiredError,
} from "../../utils/errorUtils";

export const executedOperationCreationValidation = Yup.object({
  start: Yup.string().required(requiredError("Start")),
  end: Yup.string().required(requiredError("End")),
  fromBay: Yup.number()
    .typeError(numberError("Bay"))
    .positive(positiveNumberError("Bay"))
    .integer(integerError("Bay"))
    .required(requiredError("Bay")),
  fromTier: Yup.number()
    .typeError(numberError("Tier"))
    .positive(positiveNumberError("Tier"))
    .integer(integerError("Tier"))
    .required(requiredError("Tier")),
  fromRow: Yup.number()
    .typeError(numberError("Row"))
    .positive(positiveNumberError("Row"))
    .integer(integerError("Row"))
    .required(requiredError("Row")),
  toBay: Yup.number()
    .typeError(numberError("Bay"))
    .positive(positiveNumberError("Bay"))
    .integer(integerError("Bay"))
    .required(requiredError("Bay")),
  toTier: Yup.number()
    .typeError(numberError("Tier"))
    .positive(positiveNumberError("Tier"))
    .integer(integerError("Tier"))
    .required(requiredError("Tier")),
  toRow: Yup.number()
    .typeError(numberError("Row"))
    .positive(positiveNumberError("Row"))
    .integer(integerError("Row"))
    .required(requiredError("Row")),
  containerId: Yup.string().required(requiredError("Container Id")),
});
