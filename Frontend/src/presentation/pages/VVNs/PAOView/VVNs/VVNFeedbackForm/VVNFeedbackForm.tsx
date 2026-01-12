import { Box } from "@mui/material";
import { Form, Formik } from "formik";

import FormInputField from "../../../../../shared/FormComponents/FormInputField/FormInputField";
import { feedbackValidationSchema } from "../../../../../validation/VVNValidationSchemas/feedbackValidationSchema";
import type { VVNFeedbackDto } from "../../../../../../infrastructure/dtos/vvn/vvnFeedbackDto";

interface VVNFeedbackFormProps {
  onSubmit: (values: VVNFeedbackDto, helpers: { setSubmitting: (v: boolean) => void }) => void;
  children?: React.ReactNode;
}

function VVNFeedbackForm({ onSubmit, children }: VVNFeedbackFormProps) {
  const initialValues: VVNFeedbackDto = {
    officerId: "",
    reason: ""
  };

  return (
    <Formik initialValues={initialValues} validationSchema={feedbackValidationSchema} onSubmit={onSubmit}>
      <Form>
        <Box mt={1}>
          <FormInputField required id="reason" name="reason" label="Feedback" multiline rows={5} />
        </Box>

        {children}
      </Form>
    </Formik>
  );
}

VVNFeedbackForm.displayName = "VVNFeedbackForm";

export default VVNFeedbackForm;
