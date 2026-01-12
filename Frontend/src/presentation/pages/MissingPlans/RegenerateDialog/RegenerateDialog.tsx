import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  CircularProgress,
  Box
} from "@mui/material";
import { useState } from "react";
import { useGetDailyScheduleQuery } from "../../../state-management/queries/planning-queries/useGetDailyScheduleQuery";
import { useCreateOperationPlansMutation } from "../../../state-management/mutations/scheduling-mutations/useCreateOperationPlansMutation";
import { useUserContext } from "../../../context/userContext";
import SchedulingTable from "../../Scheduling/SchedulingTable/SchedulingTable";
import type { VVN } from "../../../../domain/Types/entities/VVN";
import { algorithmTypes, type AlgorithType } from "../../../../domain/Enums/algorithmTypes";
import { useDeleteOperationPlansByDateMutation } from "../../../state-management/mutations/operation-plans-mutations/useDeleteOperationalPlansByDateMutation";

interface Props {
  isOpen: boolean;
  vvn: VVN;
  onClose: () => void;
}

export default function RegenerateDialog({ isOpen, vvn, onClose }: Props) {
  const [step, setStep] = useState<"confirm" | "preview">("confirm");
  const [selectedAlgorithm] = useState<AlgorithType>(algorithmTypes.Auto);

  const user = useUserContext();
  const deleteByDateMutation = useDeleteOperationPlansByDateMutation();
  const createOperationPlansMutation = useCreateOperationPlansMutation();

  const vvnDate = new Date(vvn.eta).toISOString().split("T")[0];

  const scheduleQuery =
    step === "preview"
      ? {
          date: vvnDate,
          algorithmType: selectedAlgorithm
        }
      : null;

  const getDailyScheduleQuery = useGetDailyScheduleQuery(scheduleQuery);

  const handleConfirmDelete = async () => {
    try {
      const date = new Date(vvnDate);
      await deleteByDateMutation.mutateAsync(date);
      setStep("preview");
    } catch (error) {
      console.error("Failed to delete operation plans:", error);
    }
  };

  const handleSavePlans = async () => {
    if (!getDailyScheduleQuery.data || getDailyScheduleQuery.data.ok !== true) return;

    const userEmail = user.email || user.name || user.sub;

    if (!userEmail) {
      console.error("User email is not available");
      return;
    }

    try {
      await createOperationPlansMutation.mutateAsync({
        schedulingDto: getDailyScheduleQuery.data,
        algorithm: getDailyScheduleQuery.data.algorithmsUsed[0],
        userEmail: userEmail,
        isRegenerated: true
      });
      onClose();
    } catch (error) {
      console.error("Failed to save operation plans:", error);
    }
  };

  const handleCancel = () => {
    setStep("confirm");
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleCancel} maxWidth="lg" fullWidth>
      <DialogTitle>{step === "confirm" ? "Regenerate Operation Plans" : "Preview New Operation Plans"}</DialogTitle>

      <DialogContent>
        {step === "confirm" ? (
          <Box>
            <Typography variant="body1" gutterBottom>
              You are about to regenerate operation plans for <strong>{new Date(vvn.eta).toLocaleDateString()}</strong>
            </Typography>
            <Typography variant="body2" color="warning.main" sx={{ mt: 2 }}>
              ⚠️ This will DELETE all existing operation plans for this day and generate new ones. This action cannot be
              undone.
            </Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>
              VVN: <strong>{vvn.code}</strong> - {vvn.vessel.name}
            </Typography>
          </Box>
        ) : (
          <Box>
            {getDailyScheduleQuery.isLoading && <CircularProgress />}

            {getDailyScheduleQuery.error && <Typography color="error">Failed to generate new schedule</Typography>}

            {getDailyScheduleQuery.data?.ok === false && (
              <Typography color="error">
                {getDailyScheduleQuery.data.reason === "no_feasible_schedule"
                  ? "No feasible schedule found."
                  : getDailyScheduleQuery.data.reason}
              </Typography>
            )}

            {getDailyScheduleQuery.data?.ok === true && (
              <SchedulingTable
                items={getDailyScheduleQuery.data.items}
                totalDelay={getDailyScheduleQuery.data.totalDelay}
                handleApprove={() => {}}
              />
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>

        {step === "confirm" ? (
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="warning"
            disabled={deleteByDateMutation.isPending}
          >
            {deleteByDateMutation.isPending ? "Deleting..." : "Continue"}
          </Button>
        ) : (
          <Button
            onClick={handleSavePlans}
            variant="contained"
            color="primary"
            disabled={createOperationPlansMutation.isPending || getDailyScheduleQuery.data?.ok !== true || !user.email}
          >
            {createOperationPlansMutation.isPending ? "Saving..." : "Save Plans"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
