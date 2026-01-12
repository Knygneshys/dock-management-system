import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { CreateIncidentCommand } from "../../../../application/incident/command/CreateIncidentComman";
import IncidentCreationForm from "./IncidentCreationForm/IncidentCreationForm";
import { accentColor } from "../../../constants/colorscheme";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  onSubmit: (command: CreateIncidentCommand) => void;
}

export default function IncidentCreationDialog({ isOpen, handleClose, onSubmit }: Props) {
  const dialogTitle = "Create Incident";

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle sx={{ textAlign: "center" }}>{dialogTitle}</DialogTitle>
      <DialogContent>
        <IncidentCreationForm onSubmit={onSubmit} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ backgroundColor: accentColor }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
