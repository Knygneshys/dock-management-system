import * as Yup from "yup";

import { requiredError } from "../../utils/errorUtils";

export const vesselUpdateValidation = Yup.object({
  imo: Yup.string().required(requiredError("Imo")),
  name: Yup.string().required(requiredError("Name")),
  typeCode: Yup.string().required(requiredError("Type")),
  operatorCode: Yup.string().required(requiredError("Operator")),
  ownerCode: Yup.string().required(requiredError("Owner")),
});
