import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

import VesselTypeSearchDialogForm from "./VesselTypeSearchDialogForm/VesselTypeSearchDialogForm";
import type { VesselTypeSearchQuery } from "../../../../../application/vessel-type/queries/VesselTypeSearchQuery";
import { accentColor } from "../../../../constants/colorscheme";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  onSubmit: (searchQuery: VesselTypeSearchQuery) => void;
}

export default function VesselTypeSearchDialog({ isOpen, handleClose, onSubmit }: Props) {
  const dialogTitle = "Search for Vessel Type";

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle sx={{ textAlign: "center" }}>{dialogTitle}</DialogTitle>
      <DialogContent>
        <VesselTypeSearchDialogForm onSubmit={onSubmit} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ backgroundColor: accentColor }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
