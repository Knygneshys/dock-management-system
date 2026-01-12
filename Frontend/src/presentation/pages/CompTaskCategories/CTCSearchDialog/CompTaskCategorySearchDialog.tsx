import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { accentColor } from "../../../constants/colorscheme";
import CompTaskCategorySearchForm from "./CTCSearchForm/CompTaskCategorySearchForm";
import { CompTaskCategorySearchQuery } from "../../../../application/complementary-task-category/queries/CompTaskCategorySearchQuery";

type Props = {
  isOpen: boolean;
  handleClose: () => void;
  initialQuery: CompTaskCategorySearchQuery;
  onApply: (q: CompTaskCategorySearchQuery) => void;
  onClear: () => void;
};

export default function CompTaskCategorySearchDialog({ isOpen, handleClose, initialQuery, onApply, onClear }: Props) {
  const dialogTitle = "Search Complementary Task Categories";

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle sx={{ textAlign: "center" }}>{dialogTitle}</DialogTitle>
      <DialogContent>
        <CompTaskCategorySearchForm
          initialQuery={initialQuery}
          onSubmit={(q: CompTaskCategorySearchQuery) => {
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
