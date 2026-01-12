import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { CreateCompTaskCategoryDTO } from "../../../../infrastructure/dtos/comp-task-category/CreateCompTaskCategoryDTO";
import CompTaskCategoryCreationForm from "./CTCCreationForm/CompTaskCategoryCreationForm";
import { accentColor } from "../../../constants/colorscheme";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  onSubmit: (dto: CreateCompTaskCategoryDTO) => void;
}

export default function CompTaskCategoryCreationDialog({ isOpen, handleClose, onSubmit }: Props) {
  const dialogTitle = "Create Complementary Task Category";

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle sx={{ textAlign: "center" }}>{dialogTitle}</DialogTitle>
      <DialogContent>
        <CompTaskCategoryCreationForm onSubmit={onSubmit} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ backgroundColor: accentColor }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
