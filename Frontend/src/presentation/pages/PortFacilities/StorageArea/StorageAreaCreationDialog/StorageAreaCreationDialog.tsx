import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

import { accentColor } from "../../../../constants/colorscheme";
import StorageAreaCreationForm from "./StorageAreaCreationForm/StorageAreaCreationForm";
import type { StorageAreaCreationDto } from "../../../../../infrastructure/dtos/storage-area/storageAreaCreationDto";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  onSubmit: (storageArea: StorageAreaCreationDto) => void;
}

export default function StorageAreaCreationDialog({ isOpen, handleClose, onSubmit }: Props) {
  const dialogTitle = "Create StorageArea";

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle sx={{ textAlign: "center" }}>{dialogTitle}</DialogTitle>
      <DialogContent>
        <StorageAreaCreationForm onSubmit={onSubmit} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ backgroundColor: accentColor }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
