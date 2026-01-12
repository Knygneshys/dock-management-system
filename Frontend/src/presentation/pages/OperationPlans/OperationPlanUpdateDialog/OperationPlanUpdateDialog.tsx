import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { UpdateOperationPlanCommand } from "../../../../application/operation-plan/commands/UpdateOperationPlanCommand";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";
import { accentColor } from "../../../constants/colorscheme";
import { useGetOperationPlanByCodeQuery } from "../../../state-management/queries/operation-plan-queries/useGetOperationPlanByCodeQuery";
import { useUpdateOperationPlanMutation } from "../../../state-management/mutations/operation-plans-mutations/useUpdateOperationPlanMutation";
import OperationPlanUpdateForm from "./OperationPlanUpdateForm/OperationPlanUpdateForm";

type Props = {
  isOpen: boolean;
  handleClose: () => void;
  operationPlanVvnCode: number;
};

export default function OperationPlanUpdateDialog({
  isOpen,
  handleClose,
  operationPlanVvnCode,
}: Props) {
  const dialogTitle = `Update Operation Plan (VvnCode: ${operationPlanVvnCode})`;
  const getOperationPlanByCodeQuery =
    useGetOperationPlanByCodeQuery(operationPlanVvnCode);
  const updateOperationPlanMutation =
    useUpdateOperationPlanMutation(operationPlanVvnCode);

  const operationPlan = getOperationPlanByCodeQuery?.data;

  const onSubmit = (command: UpdateOperationPlanCommand) => {
    updateOperationPlanMutation.mutate(command);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle sx={{ textAlign: "center" }}>{dialogTitle}</DialogTitle>
      <DialogContent>
        {operationPlan && getOperationPlanByCodeQuery.fetchStatus === "idle" ? (
          <OperationPlanUpdateForm
            operationPlan={operationPlan}
            onSubmit={onSubmit}
          />
        ) : (
          <LoadingScreen />
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
