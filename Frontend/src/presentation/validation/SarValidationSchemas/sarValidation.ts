import * as Yup from "yup";

import { requiredError }
  from "../../utils/errorUtils";

export const sarCreationValidation = Yup.object({
  name: Yup.string().required(requiredError("Name")),
  email: Yup.string().required(requiredError("Email")),
  companyCode: Yup.string().required(requiredError("Company Code")),

});
