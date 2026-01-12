import * as Yup from 'yup';

import { requiredError } from '../../utils/errorUtils';

export const dockRecordSearchValidation = Yup.object({
  name: Yup.string(),
  location: Yup.string(),
  filterOperator: Yup.number().required(requiredError("Filter Operator")),
});
