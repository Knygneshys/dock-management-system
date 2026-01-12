import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { accentColor } from "../../../../../../constants/colorscheme";
import type { OWCommand } from "../../../../../../../application/operational-window/commands/OWCommand";
import type { OperationalWindow } from "../../../../../../../domain/Types/entities/OperationalWindow";
import OperationalWindowUpdateForm from "./OWUpdateForm/OWUpdateForm";

interface OperationalWindowUpdateDialogProps {
  isOpen: boolean;
  handleClose: () => void;
  onSubmit: (command: OWCommand) => void | Promise<void>;
  operationalWindow: OperationalWindow | null;
}

export default function OperationalWindowUpdateDialog({
  isOpen,
  handleClose,
  onSubmit,
  operationalWindow,
}: OperationalWindowUpdateDialogProps) {
  if (!operationalWindow) {
    return null;
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update Operational Window</DialogTitle>
      <DialogContent>
        <OperationalWindowUpdateForm
          operationalWindow={operationalWindow}
          onSubmit={onSubmit}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ backgroundColor: accentColor }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
