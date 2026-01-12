import * as Yup from "yup";

import {
  requiredError
} from "../../utils/errorUtils";

export const qualificationUpdateValidation = Yup.object({
  name: Yup.string().required(requiredError("Name")),
});
