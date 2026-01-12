import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
} from "@mui/material";
import { useState } from "react";
import useGetRebalanceComparisonQuery from "../../state-management/queries/planning-queries/useGetRebalanceComparisonQuery";
import type { VesselDockChangeDto } from "../../../infrastructure/dtos/reabalance-comparison/vesselDockChangeDto";
import type { UnifiedScheduleItemDto } from "../../../infrastructure/dtos/reabalance-comparison/unifiedScheduleItemDto";
import { DailyScheduleItemDto } from "../../../infrastructure/dtos/scheduling/DailyScheduleItemDto";

const getFormattedTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function RebalanceComparison() {
  const [selectedDate, setSelectedDate] = useState(getFormattedTodayDate());
  const [submitDate, setSubmitDate] = useState<string | null>(null);

  const { data, isLoading, error } = useGetRebalanceComparisonQuery(submitDate);

  const handleGenerate = () => {
    setSubmitDate(selectedDate);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 4 }}>
        Dock Rebalancing Comparison
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <TextField
          required
          label="Select Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          sx={{ minWidth: 180 }}
        />
        <Button
          variant="contained"
          onClick={handleGenerate}
          disabled={isLoading}
        >
          Compare Schedules
        </Button>
      </Box>

      {isLoading && <CircularProgress />}

      {error && <Alert severity="error">Failed to generate comparison</Alert>}

      {data && (
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Current Schedule
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Total Delay: {data.oldSchedule.totalDelay} hours
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>VVN</TableCell>
                    <TableCell>Dock</TableCell>
                    <TableCell>Start</TableCell>
                    <TableCell>End</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.oldSchedule.items.map(
                    (item: DailyScheduleItemDto, idx: number) => (
                      <TableRow key={idx}>
                        <TableCell>{item.vvnCode}</TableCell>
                        <TableCell>{item.dockCode}</TableCell>
                        <TableCell>{item.start}</TableCell>
                        <TableCell>{item.end}</TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Rebalanced Schedule
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Total Delay: {data.newSchedule.totalDelay} hours
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>VVN</TableCell>
                    <TableCell>Dock</TableCell>
                    <TableCell>Start</TableCell>
                    <TableCell>End</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.oldSchedule.items.map(
                    (item: DailyScheduleItemDto, idx: number) => (
                      <TableRow key={idx}>
                        <TableCell>{item.vvnCode}</TableCell>
                        <TableCell>{item.dockCode}</TableCell>
                        <TableCell>{item.start}</TableCell>
                        <TableCell>{item.end}</TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {data.dockChanges.length > 0 && (
            <Paper sx={{ p: 2, gridColumn: "1 / -1" }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Dock Changes ({data.dockChanges.length})
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Vessel</TableCell>
                      <TableCell>Old Dock</TableCell>
                      <TableCell>→</TableCell>
                      <TableCell>New Dock</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.dockChanges.map((change: VesselDockChangeDto) => (
                      <TableRow key={change.vvnCode}>
                        <TableCell>{change.vesselName}</TableCell>
                        <TableCell>{change.oldDock}</TableCell>
                        <TableCell>→</TableCell>
                        <TableCell>{change.newDock}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </Box>
      )}
    </Box>
  );
}
