import * as Yup from "yup";

export const incidentTypeSearchValidation = Yup.object({
  code: Yup.string(),
  parentIncidentTypeCode: Yup.string(),
  description: Yup.string(),
  severity: Yup.string(),
});
