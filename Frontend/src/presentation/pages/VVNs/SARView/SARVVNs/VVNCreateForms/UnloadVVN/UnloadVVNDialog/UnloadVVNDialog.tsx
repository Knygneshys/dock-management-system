import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

import UnloadVVNForm from "../UnloadVVNForm/UnloadVVNForm";
import { accentColor } from "../../../../../../../constants/colorscheme";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
}

function UnloadVVNDialog({ isOpen, handleClose }: Props) {
  const dialogTitle = "Create Unload VVN";

  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth>
      <DialogTitle sx={{ textAlign: "center" }}>{dialogTitle}</DialogTitle>
      <DialogContent>
        <UnloadVVNForm onCreation={handleClose} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ backgroundColor: accentColor }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UnloadVVNDialog;
