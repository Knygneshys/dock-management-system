import * as Yup from "yup";
import { requiredError } from "../../utils/errorUtils";

export const incidentCreationValidation = Yup.object({
  typeCode: Yup.string().required(requiredError("Type Code")),
  start: Yup.date().required(requiredError("Start date")),
  end: Yup.date().optional(),
  description: Yup.string().required(requiredError("Description")),
  afectedVVECodes: Yup.array().of(Yup.number())
});
