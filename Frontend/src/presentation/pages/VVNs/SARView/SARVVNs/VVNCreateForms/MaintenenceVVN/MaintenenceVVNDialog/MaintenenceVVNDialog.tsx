import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

import MainteneceVVNForm from "../MainteneceVVNForm/MainteneceVVNForm";
import { accentColor } from "../../../../../../../constants/colorscheme";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
}

function MaintenenceVVNDialog({ isOpen, handleClose }: Props) {
  const dialogTitle = "Create Maintenence VVN";

  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth>
      <DialogTitle sx={{ textAlign: "center" }}>{dialogTitle}</DialogTitle>
      <DialogContent>
        <MainteneceVVNForm onCreation={handleClose} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ backgroundColor: accentColor }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default MaintenenceVVNDialog;
