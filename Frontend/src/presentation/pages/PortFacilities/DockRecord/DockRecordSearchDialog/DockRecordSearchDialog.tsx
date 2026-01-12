import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

import { accentColor } from "../../../../constants/colorscheme";
import DockRecordSearchDialogForm from "./DockRecordSearchDialogForm/DockRecordSearchDialogForm";
import type { DockRecordSearchQuery } from "../../../../../application/dock-record/queries/DockRecordSearchQuery";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  onSubmit: (searchQuery: DockRecordSearchQuery) => void;
}

export default function DockRecordSearchDialog({ isOpen, handleClose, onSubmit }: Props) {
  const dialogTitle = "Search for Dock Record";

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle sx={{ textAlign: "center" }}>{dialogTitle}</DialogTitle>
      <DialogContent>
        <DockRecordSearchDialogForm onSubmit={onSubmit} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ backgroundColor: accentColor }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
