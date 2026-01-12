import { Button, DialogActions } from "@mui/material";
import { useFormikContext } from "formik";
import type { VVNFeedbackDto } from "../../../../../../../infrastructure/dtos/vvn/vvnFeedbackDto";

function VVNFeedbackDialogActions({ onCancel }: { onCancel: () => void }) {
  const { submitForm, isSubmitting, isValid } = useFormikContext<VVNFeedbackDto>();

  return (
    <DialogActions>
      <Button onClick={onCancel} disabled={isSubmitting}>
        Cancel
      </Button>
      <Button onClick={submitForm} disabled={isSubmitting || !isValid} variant="contained">
        Send
      </Button>
    </DialogActions>
  );
}

export default VVNFeedbackDialogActions;
