import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { useGetCompTaskByCodeQuery } from "../../../state-management/queries/comp-tasks-queries/useGetCompTaskByCodeQuery";
import { useUpdateCompTaskMutation } from "../../../state-management/mutations/comp-tasks-mutations/useUpdateCompTaskMutation";
import { UpdateCompTaskDto } from "../../../../infrastructure/dtos/complementary-tasks/UpdateCompTaskDto";
import CompTaskUpdateForm from "./CompTaskUpdateForm/CompTaskUpdateForm";
import { accentColor } from "../../../constants/colorscheme";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  taskCode: string;
}

export default function CompTaskUpdateDialog({ isOpen, handleClose, taskCode }: Props) {
  const dialogTitle = `Update Complementary Task (Code: ${taskCode})`;
  const getCompTaskByCodeQuery = useGetCompTaskByCodeQuery(taskCode);
  const updateCompTaskMutation = useUpdateCompTaskMutation();

  const task = getCompTaskByCodeQuery?.data;

  const onSubmit = (updatedTask: UpdateCompTaskDto) => {
    updateCompTaskMutation.mutate({ code: taskCode, command: updatedTask });
    handleClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle sx={{ textAlign: "center" }}>{dialogTitle}</DialogTitle>
      <DialogContent>
        {task ? (
          <CompTaskUpdateForm task={task} onSubmit={onSubmit} />
        ) : (
          <Typography>Loading...</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ backgroundColor: accentColor }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}