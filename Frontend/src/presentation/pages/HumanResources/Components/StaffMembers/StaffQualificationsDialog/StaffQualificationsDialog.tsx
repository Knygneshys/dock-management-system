import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useEffect, useState } from "react";

import AddQualificationSelector from "./AddQualificationSelector/AddQualificationSelector";
import CurrentQualifications from "./CurrentQualifications/CurrentQualifications";
import type { StaffMember } from "../../../../../../domain/Types/entities/StaffMember";
import type { Qualification } from "../../../../../../domain/Types/entities/Qualification";
import { accentColor } from "../../../../../constants/colorscheme";

const EMPTY_VALUE = "";

interface StaffQualificationsDialogProps {
  isOpen: boolean;
  handleClose: () => void;
  staffMember: StaffMember | null;
  availableQualifications: Qualification[];
  onSave: (qualificationCodes: string[]) => void;
}

export default function StaffQualificationsDialog({
  isOpen,
  handleClose,
  staffMember,
  availableQualifications,
  onSave,
}: StaffQualificationsDialogProps) {
  const [selectedQualifications, setSelectedQualifications] = useState<
    string[]
  >([]);
  const [qualificationToAdd, setQualificationToAdd] =
    useState<string>(EMPTY_VALUE);

  useEffect(() => {
    if (isOpen && staffMember?.qualifications) {
      setSelectedQualifications(staffMember.qualifications.map((q) => q.code));
    }
  }, [isOpen, staffMember]);

  const handleAddQualification = () => {
    if (
      qualificationToAdd &&
      !selectedQualifications.includes(qualificationToAdd)
    ) {
      setSelectedQualifications((prev) => [...prev, qualificationToAdd]);
      setQualificationToAdd(EMPTY_VALUE);
    }
  };

  const handleRemoveQualification = (code: string) => {
    setSelectedQualifications((prev) => prev.filter((q) => q !== code));
  };

  const handleSave = () => {
    onSave(selectedQualifications);
  };

  const handleCloseDialog = () => {
    setSelectedQualifications([]);
    setQualificationToAdd(EMPTY_VALUE);
    handleClose();
  };

  const getQualificationName = (code: string): string => {
    return availableQualifications.find((q) => q.code === code)?.name || code;
  };

  const availableToAdd = availableQualifications.filter(
    (q) => !selectedQualifications.includes(q.code)
  );

  return (
    <Dialog open={isOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
      <DialogTitle>Manage Qualifications - {staffMember?.name}</DialogTitle>

      <DialogContent>
        <CurrentQualifications
          qualifications={selectedQualifications}
          onRemove={handleRemoveQualification}
          getQualificationName={getQualificationName}
        />

        <AddQualificationSelector
          availableQualifications={availableToAdd}
          selectedValue={qualificationToAdd}
          onValueChange={setQualificationToAdd}
          onAdd={handleAddQualification}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCloseDialog}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{ background: accentColor }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
