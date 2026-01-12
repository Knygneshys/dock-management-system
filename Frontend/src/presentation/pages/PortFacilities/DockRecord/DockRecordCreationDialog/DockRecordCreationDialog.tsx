import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import { accentColor } from "../../../../constants/colorscheme";
import DockRecordCreationForm from "./DockRecordCreationForm/DockRecordCreationForm";
import type { DockRecordCreateDto } from "../../../../../infrastructure/dtos/dock-record/DockRecordCreateDto";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  onSubmit: (dockRecordCreateDto: DockRecordCreateDto) => void;
}

export default function DockRecordCreationDialog({
  isOpen,
  handleClose,
  onSubmit,
}: Props) {
  const dialogTitle = "Create Dock Record";

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle sx={{ textAlign: "center" }}>{dialogTitle}</DialogTitle>
      <DialogContent>
        <DockRecordCreationForm onSubmit={onSubmit} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ backgroundColor: accentColor }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
