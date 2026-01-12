import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { CompTaskSearchQuery } from "../../../../application/complementary-task/queries/CompTaskSearchQuery";
import { accentColor } from "../../../constants/colorscheme";
import CompTaskSearchForm from "./CompTaskSearchForm/CompTaskSearchForm";


interface Props {
  isOpen: boolean;
  handleClose: () => void;
  onSubmit: (searchQuery: CompTaskSearchQuery) => void;
}

export default function CompTaskSearchDialog({ isOpen, handleClose, onSubmit }: Props) {
  const handleSearchSubmit = (searchParams: CompTaskSearchQuery) => {
    onSubmit(searchParams);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle sx={{ textAlign: "center" }}>Filter Complementary Tasks</DialogTitle>
      <DialogContent>
        <CompTaskSearchForm onSearch={handleSearchSubmit} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ backgroundColor: accentColor }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}