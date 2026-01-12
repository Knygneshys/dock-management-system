import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { SearchIncidentTypesQuery } from "../../../../application/incident-type/queries/SearchIncidentTypesQuery";
import { accentColor } from "../../../constants/colorscheme";
import IncidentSearchForm from "./IncidentSearchForm/IncidentSearchForm";

type Props = {
  isOpen: boolean;
  onSubmit: (query: SearchIncidentTypesQuery) => void;
  handleClose: () => void;
};

export default function IncidentTypeSearchDialog({
  isOpen,
  onSubmit,
  handleClose,
}: Props) {
  const dialogTitle = "Search for Incident Types";

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle sx={{ textAlign: "center" }}>{dialogTitle}</DialogTitle>
      <DialogContent>
        <IncidentSearchForm onSubmit={onSubmit} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ backgroundColor: accentColor }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
