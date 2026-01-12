import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import QualificationSearchForm from "./QualificationSearchForm/QualificationSearchForm";
import type { QualificationSearchQuery } from "../../../../../../application/qualification/queries/QualificationSearchQuery";
import { accentColor } from "../../../../../constants/colorscheme";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  onSubmit: (searchQuery: QualificationSearchQuery) => void;
}

export default function QualificationSearchDialog({ isOpen, handleClose, onSubmit }: Props) {
  const handleSearchSubmit = (searchParams: QualificationSearchQuery) => {
    onSubmit(searchParams);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle sx={{ textAlign: "center" }}>Filter Qualifications</DialogTitle>
      <DialogContent>
        <QualificationSearchForm onSearch={handleSearchSubmit} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ backgroundColor: accentColor }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
