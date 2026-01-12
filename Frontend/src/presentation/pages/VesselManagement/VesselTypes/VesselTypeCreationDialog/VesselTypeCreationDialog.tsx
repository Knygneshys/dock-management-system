import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import VesselTypeCreationForm from "./VesselTypeCreationForm/VesselTypeCreationForm";
import type { VesselType } from "../../../../../domain/Types/entities/VesselType";
import { accentColor } from "../../../../constants/colorscheme";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  onSubmit: (values: VesselType) => void;
}

export default function VesselTypeCreationDialog({
  isOpen,
  handleClose,
  onSubmit,
}: Props) {
  const dialogTitle = "Create Vessel Type";

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle sx={{ textAlign: "center" }}>{dialogTitle}</DialogTitle>
      <DialogContent>
        <VesselTypeCreationForm onSubmit={onSubmit} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ backgroundColor: accentColor }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
