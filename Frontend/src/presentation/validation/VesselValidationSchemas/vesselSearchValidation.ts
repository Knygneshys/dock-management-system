import * as Yup from 'yup';

export const vesselSearchValidation = Yup.object({
  imo: Yup.string(),
  name: Yup.string(),
  operatorCode: Yup.string(),
});
