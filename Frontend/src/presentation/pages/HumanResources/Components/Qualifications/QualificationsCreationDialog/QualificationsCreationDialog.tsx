import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

import QualificationCreationForm from "./QualificationCreationForm/QualificationCreationForm";
import type { QualificationCreateDto } from "../../../../../../infrastructure/dtos/qualification/qualificationCreateDto";
import { accentColor } from "../../../../../constants/colorscheme";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  onSubmit: (qualification: QualificationCreateDto) => void;
}

export default function QualificationsCreationDialogue({ isOpen, handleClose, onSubmit }: Props) {
  const dialogTitle = "Create Qualification";
  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle sx={{ textAlign: "center" }}>{dialogTitle}</DialogTitle>
      <DialogContent>
        <QualificationCreationForm onSubmit={onSubmit} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ backgroundColor: accentColor }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
