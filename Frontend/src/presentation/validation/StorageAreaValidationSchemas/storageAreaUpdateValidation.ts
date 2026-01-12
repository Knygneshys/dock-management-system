import * as Yup from "yup";

import { integerError, numberError, positiveNumberError, requiredError } from "../../utils/errorUtils";

const maxCapacity = "Max Capacity";
const currentOccupancy = "Current Occupancy";
const MIN_VALUE = 0;

export const storageAreaUpdateValidation = Yup.object({
  type: Yup.string().required(requiredError("Type")),
  location: Yup.string().required(requiredError("Location")),
  maxCapacity: Yup.number()
    .typeError(numberError(maxCapacity))
    .positive(positiveNumberError(maxCapacity))
    .integer(integerError(maxCapacity))
    .required(requiredError(maxCapacity)),
  currentOccupancy: Yup.number()
    .typeError(numberError(currentOccupancy))
    .min(MIN_VALUE, positiveNumberError(currentOccupancy))
    .integer(integerError(currentOccupancy))
    .required(requiredError(currentOccupancy)),
  width: Yup.number()
    .typeError(numberError("Width"))
    .min(MIN_VALUE, positiveNumberError("Width"))
    .integer(integerError("Width"))
    .required(requiredError("Width")),
  height: Yup.number()
    .typeError(numberError("Height"))
    .min(MIN_VALUE, positiveNumberError("Height"))
    .integer(integerError("Height"))
    .required(requiredError("Height")),
  depth: Yup.number()
    .typeError(numberError("Depth"))
    .min(MIN_VALUE, positiveNumberError("Depth"))
    .integer(integerError("Depth"))
    .required(requiredError("Depth")),
  x: Yup.number().typeError(numberError("X Position")).required(requiredError("X Position")),
  y: Yup.number().typeError(numberError("Y Position")).required(requiredError("Y Position")),
  z: Yup.number().typeError(numberError("Z Position")).required(requiredError("Z Position")),
});
