import * as Yup from "yup";
import { requiredError } from "../../utils/errorUtils";

export const incidentTypeCreationValidation = Yup.object({
  code: Yup.string().required(requiredError("Code")),
  name: Yup.string().required(requiredError("Name")),
  description: Yup.string().required(requiredError("Description")),
  severity: Yup.string().required(requiredError("Severity")),
});
