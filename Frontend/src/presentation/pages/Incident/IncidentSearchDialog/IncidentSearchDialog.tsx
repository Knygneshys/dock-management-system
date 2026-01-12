import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { SearchIncidentQuery } from "../../../../application/incident/queries/SearchIncidentQuery";
import IncidentSearchForm from "./IncidentSearchForm/IncidentSearchForm";
import { accentColor } from "../../../constants/colorscheme";

type Props = {
  isOpen: boolean;
  handleClose: () => void;
  initialQuery: SearchIncidentQuery;
  onApply: (q: SearchIncidentQuery) => void;
  onClear: () => void;
};

export default function IncidentSearchDialog({ isOpen, handleClose, initialQuery, onApply, onClear }: Props) {
  const dialogTitle = "Search Incidents";

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle sx={{ textAlign: "center" }}>{dialogTitle}</DialogTitle>
      <DialogContent>
        <IncidentSearchForm
          initialQuery={initialQuery}
          onSubmit={(q: SearchIncidentQuery) => {
            onApply(q);
            handleClose();
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onClear();
            handleClose();
          }}
          sx={{ backgroundColor: accentColor }}
        >
          Clear
        </Button>
        <Button onClick={handleClose} sx={{ backgroundColor: accentColor }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
