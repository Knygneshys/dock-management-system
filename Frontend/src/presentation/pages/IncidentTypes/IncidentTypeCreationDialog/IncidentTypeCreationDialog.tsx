import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { IncidentType } from "../../../../domain/Types/entities/IncidentType";
import { accentColor } from "../../../constants/colorscheme";
import IncidentTypeCreationForm from "./IncidentTypeCreationForm/IncidentTypeCreationForm";

type Props = {
  onSubmit: (incidentType: IncidentType) => void;
  isOpen: boolean;
  handleClose: () => void;
};

export default function IncidentTypeCreationDialog({
  onSubmit,
  isOpen,
  handleClose,
}: Props) {
  const dialogTitle = "Create Incident Type";

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle sx={{ textAlign: "center" }}>{dialogTitle}</DialogTitle>
      <DialogContent>
        <IncidentTypeCreationForm onSubmit={onSubmit} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ backgroundColor: accentColor }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
