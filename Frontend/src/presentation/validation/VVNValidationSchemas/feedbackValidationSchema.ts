import * as Yup from "yup";

import { requiredError } from "../../utils/errorUtils";

const MIN_FEEDBACK_LENGHT = 12;

export const feedbackValidationSchema = Yup.object({
  reason: Yup.string().required(requiredError("Feedback")).min(MIN_FEEDBACK_LENGHT, `Feedback must be at least ${MIN_FEEDBACK_LENGHT} characters long`),
});
