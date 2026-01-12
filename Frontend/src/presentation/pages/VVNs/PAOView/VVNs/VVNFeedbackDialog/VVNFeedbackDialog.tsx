import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import { useUserContext } from "../../../../../context/userContext";
import VVNFeedbackForm from "../VVNFeedbackForm/VVNFeedbackForm";
import type { VVN } from "../../../../../../domain/Types/entities/VVN";
import type { VVNFeedbackDto } from "../../../../../../infrastructure/dtos/vvn/vvnFeedbackDto";
import { useSendBackVVNMutation } from "../../../../../state-management/mutations/vvn-mutations/review-mutations/useSendBackVVNMutation";
import { useAproveVVNMutation } from "../../../../../state-management/mutations/vvn-mutations/review-mutations/useAproveVVNMutation";
import { useRejectVVNMutation } from "../../../../../state-management/mutations/vvn-mutations/review-mutations/useRejectVVNMutation";
import { VVN_SUBMISSION_TYPE } from "../../../../../../domain/Enums/vvnSubmissionType";
import VVNFeedbackDialogActions from "./Actions/VVNFeedbackDialogActions";
import { primaryColor } from "../../../../../constants/colorscheme";

interface Props {
  vvn: VVN;
  open: boolean;
  onClose: () => void;
  submissionType: number | null;
}
function VVNFeedBackDialog({ vvn, open, onClose, submissionType }: Props) {
  const sendBackMutation = useSendBackVVNMutation();
  const aproveMutation = useAproveVVNMutation();
  const rejectMutation = useRejectVVNMutation();
  const user = useUserContext();

  const titleMessage = () => {
    switch (submissionType) {
      case VVN_SUBMISSION_TYPE.IN_PROGRESS:
        return "Send Back VVN ";
      case VVN_SUBMISSION_TYPE.APROVE:
        return "Approve VVN ";
      case VVN_SUBMISSION_TYPE.REJECT:
        return "Reject VVN ";
      default:
        return "";
    }
  };

  const onSubmit = async (
    values: VVNFeedbackDto,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    const { reason } = values;
    const userEmail = user.email;
    const vvnCode = vvn.code;

    const feedback = {
      reason: reason,
      officerId: userEmail,
    } as VVNFeedbackDto;
    try {
      switch (submissionType) {
        case VVN_SUBMISSION_TYPE.IN_PROGRESS:
          await sendBackMutation.mutateAsync({ feedback, vvnCode });
          break;
        case VVN_SUBMISSION_TYPE.APROVE:
          await aproveMutation.mutateAsync({ feedback, vvnCode });
          break;
        case VVN_SUBMISSION_TYPE.REJECT:
          await rejectMutation.mutateAsync({ feedback, vvnCode });
          break;
        default:
          throw new Error("Invalid feedback type");
      }
    } catch {
      //emp
    } finally {
      setSubmitting(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {titleMessage()}
        <Typography
          fontSize="1.25rem"
          component="span"
          sx={{
            fontWeight: "bold",
            color: primaryColor,
          }}
        >
          {vvn.code}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <VVNFeedbackForm onSubmit={onSubmit}>
          <VVNFeedbackDialogActions onCancel={onClose} />
        </VVNFeedbackForm>
      </DialogContent>
    </Dialog>
  );
}

export default VVNFeedBackDialog;
