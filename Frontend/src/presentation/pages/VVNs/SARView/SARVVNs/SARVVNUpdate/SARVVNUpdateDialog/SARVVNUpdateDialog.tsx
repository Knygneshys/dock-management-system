import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import SARVVNUpdateForm from "../SARVVNUpdateForm/SARVVNUpdateForm";
import type { VVN } from "../../../../../../../domain/Types/entities/VVN";
import { accentColor } from "../../../../../../constants/colorscheme";

interface Props {
  vvn: VVN;
  isOpen: boolean;
  handleClose: () => void;
}

function SARVVNUpdateDialog({ vvn, isOpen, handleClose }: Props) {
  const dialogTitle = "Update VVN";

  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth>
      <DialogTitle sx={{ textAlign: "center" }}>{dialogTitle}</DialogTitle>
      <DialogContent>
        <SARVVNUpdateForm vvn={vvn} onCreation={handleClose} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ backgroundColor: accentColor }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SARVVNUpdateDialog;
