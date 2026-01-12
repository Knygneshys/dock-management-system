import {
  Button,
  Divider,
  Stack,
  TableContainer,
  Typography,
} from "@mui/material";
import HeaderTable from "./HeaderTable/HeaderTable";
import PlannedOperationTable from "./PlannedOperationTable/PlannedOperationTable";
import { DailyScheduleItemDto } from "../../../../infrastructure/dtos/scheduling/DailyScheduleItemDto";

interface Props {
  items: DailyScheduleItemDto[];
  totalDelay: number;
  handleApprove: () => void;
}

export default function SchedulingTable({
  items,
  totalDelay,
  handleApprove,
}: Props) {
  return (
    <>
      <Stack direction="row" spacing={4}>
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          Total Delay: {totalDelay}
        </Typography>
        <Button variant="contained" color="success" onClick={handleApprove}>
          Approve
        </Button>
      </Stack>

      {items.map((item, index) => (
        <TableContainer key={index}>
          <HeaderTable item={item} />
          <PlannedOperationTable plannedOperations={item.plannedOperations} />
          <Divider />
        </TableContainer>
      ))}
    </>
  );
}
