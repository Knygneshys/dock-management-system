import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

import { accentColor } from "../../../../constants/colorscheme";
import DockUpdateForm from "./DockUpdateForm/DockUpdateForm";
import type { DockRecordUpdateDto } from "../../../../../infrastructure/dtos/dock-record/DockRecordUpdateDto";
import { useGetDockRecordByIdQuery } from "../../../../state-management/queries/dock-record-queries/useGetDockRecordByIdQuery";
import { useUpdateDockRecordMutation } from "../../../../state-management/mutations/dock-record-mutations/useUpdateDockRecordMutation";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  dockRecordCode: string;
}

export default function DockRecordUpdateDialog({
  isOpen,
  handleClose,
  dockRecordCode,
}: Props) {
  const dialogTitle = `Update Dock Record (Code: ${dockRecordCode})`;
  const getDockRecordByIdQuery = useGetDockRecordByIdQuery(dockRecordCode);
  const updateDockRecordMutation = useUpdateDockRecordMutation(dockRecordCode);

  const dockRecord = getDockRecordByIdQuery?.data;

  const onSubmit = (updatedDockRecord: DockRecordUpdateDto) => {
    updateDockRecordMutation.mutate(updatedDockRecord, {
      onSuccess: () => {
        handleClose();
      },
      onError: () => {},
    });
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle sx={{ textAlign: "center" }}>{dialogTitle}</DialogTitle>
      <DialogContent>
        {dockRecord ? (
          <DockUpdateForm dockRecord={dockRecord} onSubmit={onSubmit} />
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
