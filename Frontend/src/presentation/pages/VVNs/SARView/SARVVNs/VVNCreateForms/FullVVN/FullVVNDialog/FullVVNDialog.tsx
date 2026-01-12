import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

import FullVVNForm from "../FullVVNForm/FullVVNForm";
import { accentColor } from "../../../../../../../constants/colorscheme";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
}

function FullVVNDialog({ isOpen, handleClose }: Props) {
  const dialogTitle = "Create Full VVN";

  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth>
      <DialogTitle sx={{ textAlign: "center" }}>{dialogTitle}</DialogTitle>
      <DialogContent>
        <FullVVNForm onCreation={handleClose} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ backgroundColor: accentColor }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default FullVVNDialog;
