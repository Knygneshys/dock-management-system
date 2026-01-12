import * as Yup from "yup";

import { requiredError } from "../../utils/errorUtils";

export const staffMemberUpdateValidation = Yup.object({
  mecanographicNumber: Yup.number()
    .transform((value, originalValue) => originalValue === '' ? undefined : value)
    .required(requiredError("Mecanographic Number"))
    .positive("Must be a positive number")
    .integer("Must be an integer"),
  name: Yup.string().required(requiredError("Name")),
  email: Yup.string()
    .email("Must be a valid email")
    .required(requiredError("Email")),
  phone: Yup.number()
    .transform((value, originalValue) => originalValue === '' ? undefined : value)
    .required(requiredError("Phone"))
    .positive("Must be a positive number")
    .integer("Must be an integer"),
});