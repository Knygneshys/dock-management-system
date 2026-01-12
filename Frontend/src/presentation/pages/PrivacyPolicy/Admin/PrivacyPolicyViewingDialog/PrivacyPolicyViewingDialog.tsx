import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { PrivacyPolicy } from "../../../../../domain/Types/entities/PrivacyPolicy";
import { accentColor } from "../../../../constants/colorscheme";
import Markdown from "react-markdown";

type Props = {
  privacyPolicy: PrivacyPolicy;
  isOpen: boolean;
  handleClose: () => void;
};

export default function PrivacyPolicyViewingDialog({
  privacyPolicy,
  isOpen,
  handleClose,
}: Props) {
  const creationDate = new Date(privacyPolicy.createdAt);
  const dialogTitle = `Version ${privacyPolicy.version}. Created at ${creationDate.toLocaleString()}`;

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle sx={{ textAlign: "center" }}>{dialogTitle}</DialogTitle>
      <DialogContent>
        <Markdown>{privacyPolicy.content}</Markdown>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ backgroundColor: accentColor }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
