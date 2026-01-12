import * as Yup from 'yup';

import { requiredError } from '../../utils/errorUtils';

export const vesselTypeSearchValidation = Yup.object({
  name: Yup.string(),
  description: Yup.string(),
  filterOperator: Yup.number().required(requiredError("Filter Operator")),
});
