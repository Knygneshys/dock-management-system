import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { VVEtoIncidentCommand } from "../../../../application/incident/command/VVEtoIncidentCommand";
import { accentColor } from "../../../constants/colorscheme";
import { VVE } from "../../../../domain/Types/entities/VVE";
import DetachVVEForm from "./DetachVVEForm/DetachVVEForm";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  onSubmit: (command: VVEtoIncidentCommand) => void;
  incidentCode: string;
  vves: VVE[];
}

export default function DetachVVEDialog({ isOpen, handleClose, onSubmit, incidentCode, vves }: Props) {
  const dialogTitle = `Detach VVE from Incident ${incidentCode}`;

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle sx={{ textAlign: "center" }}>{dialogTitle}</DialogTitle>
      <DialogContent>
        <DetachVVEForm onSubmit={onSubmit} incidentCode={incidentCode} vves={vves} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ backgroundColor: accentColor }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
