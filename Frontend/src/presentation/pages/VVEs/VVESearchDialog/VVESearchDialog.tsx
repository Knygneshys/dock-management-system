import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { VVESearchQuery } from "../../../../application/vve/queries/VVESearchQuery";
import { accentColor } from "../../../constants/colorscheme";
import VVESearchForm from "./VVESearchForm/VVESearchForm";


interface Props {
  isOpen: boolean;
  handleClose: () => void;
  onSubmit: (searchQuery: VVESearchQuery) => void;
}

export default function VVESearchDialog({ isOpen, handleClose, onSubmit }: Props) {
  const handleSearchSubmit = (searchParams: VVESearchQuery) => {
    onSubmit(searchParams);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle sx={{ textAlign: "center" }}>Filter VVEs</DialogTitle>
      <DialogContent>
        <VVESearchForm onSearch={handleSearchSubmit} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ backgroundColor: accentColor }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}