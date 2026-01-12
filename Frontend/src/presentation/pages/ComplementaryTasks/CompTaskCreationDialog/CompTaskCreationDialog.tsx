import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { CreateCompTaskDto } from "../../../../infrastructure/dtos/complementary-tasks/CreateCompTaskDto";
import { accentColor } from "../../../constants/colorscheme";
import CompTaskCreationForm from "./CompTaskCreationForm/CompTaskCreationForm";


interface Props {
  isOpen: boolean;
  handleClose: () => void;
  onSubmit: (compTask: CreateCompTaskDto) => void;
}

export default function CompTaskCreationDialog({ isOpen, handleClose, onSubmit }: Props) {
  const dialogTitle = "Create Complementary Task";
  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ textAlign: "center" }}>{dialogTitle}</DialogTitle>
      <DialogContent>
        <CompTaskCreationForm onSubmit={onSubmit} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ backgroundColor: accentColor }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}