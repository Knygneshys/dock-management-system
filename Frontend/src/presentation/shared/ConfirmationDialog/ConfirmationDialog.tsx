import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { accentColor } from "../../constants/colorscheme";

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmationDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Yes",
  cancelText = "Cancel"
}: ConfirmationDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>{message}</DialogContent>

      <DialogActions>
        <Button onClick={onCancel} color="inherit">
          {cancelText}
        </Button>

        <Button onClick={onConfirm} sx={{ backgroundColor: accentColor }} variant="contained">
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
