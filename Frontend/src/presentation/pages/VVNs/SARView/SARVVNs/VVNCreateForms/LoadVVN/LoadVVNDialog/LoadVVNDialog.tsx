import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

import LoadVVNForm from "../LoadVVNForm/LoadVVNForm";
import { accentColor } from "../../../../../../../constants/colorscheme";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
}

function LoadVVNDialog({ isOpen, handleClose }: Props) {
  const dialogTitle = "Create Load VVN";

  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth>
      <DialogTitle sx={{ textAlign: "center" }}>{dialogTitle}</DialogTitle>
      <DialogContent>
        <LoadVVNForm onCreation={handleClose} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ backgroundColor: accentColor }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default LoadVVNDialog;
