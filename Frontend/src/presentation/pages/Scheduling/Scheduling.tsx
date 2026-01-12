/* eslint-disable no-magic-numbers */
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import SchedulingTable from "./SchedulingTable/SchedulingTable.js";
import useGetDailyScheduleQuery from "../../state-management/queries/planning-queries/useGetDailyScheduleQuery";
import {
  algorithmTypes,
  AlgorithType,
} from "../../../domain/Enums/algorithmTypes";
import type { SchedulingGetDailyQuery } from "../../../application/scheduling/queries/schedulingGetDailyQuery";
import { useCreateOperationPlansMutation } from "../../state-management/mutations/scheduling-mutations/useCreateOperationPlansMutation";
import { useUserContext } from "../../context/userContext";

const getFormattedTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};


export default function Scheduling() {
  const [selectedDate, setSelectedDate] = useState(getFormattedTodayDate());
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithType>(algorithmTypes.Auto);
  const [computeTimeMS, setComputeTimeMS] = useState<string>("");

  const [submittedQuery, setSubmittedQuery] = useState<SchedulingGetDailyQuery & { computeTimeMS?: number } | null>(null);

  const user = useUserContext();

  const createOperationPlansMutation = useCreateOperationPlansMutation();
  const getDailyScheduleQuery = useGetDailyScheduleQuery(submittedQuery);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }

    const queryObj = {
      date: selectedDate,
      algorithmType: selectedAlgorithm,
      ...(computeTimeMS ? { computeTimeMS: Number(computeTimeMS) } : {}),
      _nonce: Date.now()
    };
    setSubmittedQuery(queryObj);
    getDailyScheduleQuery.refetch();
  };

  const handleApprove = () => {
    if (
      getDailyScheduleQuery.data !== null &&
      getDailyScheduleQuery.data !== undefined
    ) {
      createOperationPlansMutation.mutate({
        schedulingDto: getDailyScheduleQuery.data,
        algorithm: getDailyScheduleQuery.data.algorithmsUsed[0],
        userEmail: user.email!,
      });
    }
  };

  return (
    <Box component="div" sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 4 }}>
        Daily Schedule Planner
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          gap: 3,
          mb: 4,
          alignItems: "flex-end",
        }}
      >
        <TextField
          required
          label="Select Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          sx={{ minWidth: 180 }}
        />

        <FormControl required sx={{ minWidth: 200 }}>
          <InputLabel id="algorithm-select-label">Algorithm Type</InputLabel>
          <Select
            labelId="algorithm-select-label"
            value={selectedAlgorithm}
            label="Algorithm Type"
            onChange={(e) => setSelectedAlgorithm(e.target.value)}
          >
            <MenuItem value={algorithmTypes.Auto}>Auto (recomended)</MenuItem>
            <MenuItem value={algorithmTypes.Heuristic}>Heuristic</MenuItem>
            <MenuItem value={algorithmTypes.Optimal}>Optimal</MenuItem>
            <MenuItem value={algorithmTypes.Genetic}>Genetic</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Time Limit (ms) (optional)"
          type="number"
          value={computeTimeMS}
          onChange={(e) => setComputeTimeMS(e.target.value)}
          sx={{ minWidth: 160 }}
          inputProps={{ min: 0 }}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={getDailyScheduleQuery.isLoading}
          sx={{ height: 56 }}
        >
          Generate Schedule
        </Button>
      </Box>

      {getDailyScheduleQuery.isLoading && <CircularProgress />}

      {getDailyScheduleQuery.error && (
        <Typography color="error">Failed to fetch schedule</Typography>
      )}

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
          handleApprove={handleApprove}
        />
      )}
    </Box>
  );
}
