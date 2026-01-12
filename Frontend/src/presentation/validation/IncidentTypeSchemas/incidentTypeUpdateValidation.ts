import * as Yup from "yup";
import { requiredError } from "../../utils/errorUtils";

export const incidentTypeUpdateValidation = Yup.object({
  name: Yup.string().required(requiredError("Name")),
  description: Yup.string().required(requiredError("Description")),
  severity: Yup.string().required(requiredError("Severity")),
});
