import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

import ResoureSearchBar from "../ResourceSearchBar/ResourceSearchBar";
import type { ResourceSearchQuery } from "../../../../application/resource/queries/resourceSearchQuery";
import { accentColor } from "../../../constants/colorscheme";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  onChange: (value: any) => void;
  searchQuery: ResourceSearchQuery;
}

function ResourceSearchDialog({ isOpen, handleClose, onChange, searchQuery }: Props) {
  const dialogTitle = "Search for Resource";

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle sx={{ textAlign: "center" }}>{dialogTitle}</DialogTitle>
      <DialogContent>
        <ResoureSearchBar value={searchQuery} onChange={onChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ backgroundColor: accentColor }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ResourceSearchDialog;
