import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

import ResourceCreationForm from "./ResourceCreationForm/ResourceCreationForm";
import { accentColor } from "../../../constants/colorscheme";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
}

export default function ResourceCreationDialog({ isOpen, handleClose }: Props) {
  const dialogTitle = "Create Resource";

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle sx={{ textAlign: "center" }}>{dialogTitle}</DialogTitle>
      <DialogContent>
        <ResourceCreationForm onCreation={handleClose} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ backgroundColor: accentColor }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
