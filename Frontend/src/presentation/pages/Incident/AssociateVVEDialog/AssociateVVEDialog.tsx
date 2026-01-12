import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { VVEtoIncidentCommand } from "../../../../application/incident/command/VVEtoIncidentCommand";
import { accentColor } from "../../../constants/colorscheme";
import AssociateVVEForm from "./AssociateVVEForm/AssociateVVEForm";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  onSubmit: (command: VVEtoIncidentCommand) => void;
  incidentCode: string;
}

export default function AssociateVVEDialog({ isOpen, handleClose, onSubmit, incidentCode }: Props) {
  const dialogTitle = `Associate VVE to Incident ${incidentCode}`;

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle sx={{ textAlign: "center" }}>{dialogTitle}</DialogTitle>
      <DialogContent>
        <AssociateVVEForm onSubmit={onSubmit} incidentCode={incidentCode} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ backgroundColor: accentColor }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
