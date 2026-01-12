import * as Yup from "yup";

import { requiredError }
  from "../../utils/errorUtils";

export const qualificationCreationValidation = Yup.object({
  code: Yup.string().required(requiredError("Code")),
  name: Yup.string().required(requiredError("Name")),
});
