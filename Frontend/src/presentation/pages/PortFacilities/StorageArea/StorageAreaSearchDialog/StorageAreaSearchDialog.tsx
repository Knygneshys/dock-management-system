import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

import { accentColor } from "../../../../constants/colorscheme";
import StorageAreaSearchDialogForm from "./StorageAreaSearchDialogForm/StorageAreaSearchDialogForm";
import type { StorageAreaSearchQuery } from "../../../../../application/storage-area/queries/storageAreaSearchQuery";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  onSubmit: (searchQuery: StorageAreaSearchQuery) => void;
}

export default function StorageAreaSearchDialog({ isOpen, handleClose, onSubmit }: Props) {
  const dialogTitle = "Search for StorageArea";

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle sx={{ textAlign: "center" }}>{dialogTitle}</DialogTitle>
      <DialogContent>
        <StorageAreaSearchDialogForm onSubmit={onSubmit} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ backgroundColor: accentColor }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
