import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

import StaffMemberCreationForm from "./StaffMemberCreationForm/StaffMemberCreationForm";
import type { staffCreateDto } from "../../../../../../infrastructure/dtos/staff-member/staffCreateDto";
import { accentColor } from "../../../../../constants/colorscheme";

interface StaffMemberCreationDialogueProps {
  isOpen: boolean;
  handleClose: () => void;
  onSubmit: (values: staffCreateDto) => void | Promise<void>;
}

export default function StaffMemberCreationDialogue({
  isOpen,
  handleClose,
  onSubmit
}: StaffMemberCreationDialogueProps) {
  const dialogTitle = "Create Staff Member";

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle sx={{ textAlign: "center" }}>{dialogTitle}</DialogTitle>

      <DialogContent>
        <StaffMemberCreationForm onSubmit={onSubmit} />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} sx={{ backgroundColor: accentColor }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
