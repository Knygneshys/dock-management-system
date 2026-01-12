import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import SarCreationForm from "./SARCreationForm/SARCreationForm";
import type { ShippingAgentRepresentative } from "../../../../domain/Types/entities/ShippingAgentRepresentative";
import { accentColor } from "../../../constants/colorscheme";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  onSubmit: (sar: ShippingAgentRepresentative) => void;
}

export default function SARCreationDialog({
  isOpen,
  handleClose,
  onSubmit,
}: Props) {
  const dialogTitle = "Create Shipping Agent Representative";
  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle sx={{ textAlign: "center" }}>{dialogTitle}</DialogTitle>
      <DialogContent>
        <SarCreationForm onSubmit={onSubmit} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ backgroundColor: accentColor }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
