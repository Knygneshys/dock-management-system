import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { accentColor } from "../../../constants/colorscheme";
import { useGetExecutedOperationsByVveQuery } from "../../../state-management/queries/vvn-queries/useGetExecutedOperationsByVveQuery";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";
import ExecutedOperationTable from "./ExecutedOperationTable/ExecutedOperationTable";
import { useState } from "react";
import ExecutedOperationCreationForm from "./ExecutedOperationCreationForm/ExecutedOperationCreationForm";
import { useGetOperationPlanByCodeQuery } from "../../../state-management/queries/operation-plan-queries/useGetOperationPlanByCodeQuery";
import { useAddExecutedOperationToVveMutation } from "../../../state-management/mutations/vve-mutations/useAddExecutedOperationToVveMutation";
import { ExecutedOperation } from "../../../../domain/Types/entities/ExecutedOperation";

type Props = {
  isOpen: boolean;
  vveCode: number;
  handleClose: () => void;
};

export default function ExecutedOperationDialog({
  isOpen,
  handleClose,
  vveCode,
}: Props) {
  const [isFormVisible, setIsFormVisible] = useState(false);

  const getExecutedOperationsByVveQuery =
    useGetExecutedOperationsByVveQuery(vveCode);

  const getOperationPlanByCodeQuery = useGetOperationPlanByCodeQuery(vveCode);

  const addExecutedOperationToVve =
    useAddExecutedOperationToVveMutation(vveCode);

  const dialogTitle = `Executed Operations of VVE code: ${vveCode}`;

  const executedOperations = getExecutedOperationsByVveQuery.data;
  const plannedOperations = getOperationPlanByCodeQuery.data?.plannedOperations;

  const onClose = () => {
    setIsFormVisible(false);
    handleClose();
  };

  const onSubmit = (executedOperation: ExecutedOperation) => {
    addExecutedOperationToVve.mutate(executedOperation);
    setIsFormVisible(false);
  };

  if (
    getExecutedOperationsByVveQuery.isLoading ||
    getOperationPlanByCodeQuery.isLoading
  )
    return <LoadingScreen />;

  if (
    getExecutedOperationsByVveQuery.isError ||
    executedOperations === undefined
  ) {
    return <Typography>Failed to fetch executed operations!</Typography>;
  }

  if (getOperationPlanByCodeQuery.isError || plannedOperations === undefined) {
    return <Typography>Failed to fetch planned operations!</Typography>;
  }

  const plannedContainers = plannedOperations.map((op) => op.containerId);
  const executedContainers = executedOperations.map((op) => op.containerId);

  const missingContainers = plannedContainers.filter(
    (id) => !executedContainers.includes(id),
  );

  const allOperationsHaveBeenExecuted =
    executedOperations.length >= plannedOperations.length;

  let upcomingPlannedOperation;
  if (executedOperations.length < plannedOperations.length) {
    upcomingPlannedOperation = plannedOperations[executedOperations.length - 1];
  }

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle sx={{ textAlign: "center" }}>{dialogTitle}</DialogTitle>
      <DialogContent>
        <ExecutedOperationTable executedOperations={executedOperations} />
        {isFormVisible &&
          !allOperationsHaveBeenExecuted &&
          upcomingPlannedOperation && (
            <Box sx={{ mt: 2, p: 2, border: "1px dashed grey" }}>
              <ExecutedOperationCreationForm
                containers={missingContainers}
                onSubmit={onSubmit}
                plannedOperation={upcomingPlannedOperation!}
              />
              <Box sx={{ textAlign: "center", marginTop: "20px" }}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setIsFormVisible(false)}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          )}
      </DialogContent>
      <DialogActions>
        {!isFormVisible &&
          !allOperationsHaveBeenExecuted &&
          upcomingPlannedOperation && (
            <Button
              onClick={() => setIsFormVisible(true)}
              sx={{
                backgroundColor: accentColor,
              }}
            >
              Add
            </Button>
          )}
        <Button
          onClick={onClose}
          sx={{
            backgroundColor: accentColor,
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
