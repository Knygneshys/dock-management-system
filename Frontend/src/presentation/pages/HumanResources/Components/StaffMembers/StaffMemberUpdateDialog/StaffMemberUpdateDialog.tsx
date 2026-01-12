import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

import StaffMemberUpdateForm from "./StaffMemberUpdateForm/StaffMemberUpdateForm";
import type { StaffMember } from "../../../../../../domain/Types/entities/StaffMember";
import { useUpdateStaffMemberMutation } from "../../../../../state-management/mutations/staff-member-mutations/useUpdateStaffMemberMutation";
import type { staffUpdateDto } from "../../../../../../infrastructure/dtos/staff-member/staffUpdateDto";
import { accentColor } from "../../../../../constants/colorscheme";

interface StaffMemberUpdateDialogProps {
  isOpen: boolean;
  handleClose: () => void;
  staffMember: StaffMember | null;
}

export default function StaffMemberUpdateDialog({
  isOpen,
  handleClose,
  staffMember,
}: StaffMemberUpdateDialogProps) {
  const dialogTitle = staffMember
    ? `Update Staff Member (Code: ${staffMember.mecanographicNumber})`
    : "Update Staff Member";

  const updateStaffMemberMutation = useUpdateStaffMemberMutation();

  const onSubmit = (updatedDto: staffUpdateDto) => {
    if (!staffMember) return;

    updateStaffMemberMutation.mutate({
      mecanographicNumber: staffMember.mecanographicNumber,
      staffMember: updatedDto,
    });

    handleClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle sx={{ textAlign: "center" }}>{dialogTitle}</DialogTitle>

      <DialogContent>
        {staffMember ? (
          <StaffMemberUpdateForm
            staffMember={staffMember}
            onSubmit={onSubmit}
          />
        ) : (
          <Typography>Loading...</Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} sx={{ backgroundColor: accentColor }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
