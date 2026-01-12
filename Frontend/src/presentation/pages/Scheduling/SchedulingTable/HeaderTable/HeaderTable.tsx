import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import type { DailyScheduleItemDto } from "../../../../../infrastructure/dtos/scheduling/DailyScheduleItemDto";

interface Props {
  item: DailyScheduleItemDto;
}

const convertTimeFromWeekHoursToDayHours = (time: number) => {
  return time % 24;
};

export default function HeaderTable({ item }: Props) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Vvn Code</TableCell>
          <TableCell>Dock</TableCell>
          <TableCell>Start</TableCell>
          <TableCell>End</TableCell>
          <TableCell>Storage Area</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>{item.vvnCode}</TableCell>
          <TableCell>{item.dockCode}</TableCell>
          <TableCell>
            {convertTimeFromWeekHoursToDayHours(item.start)}
          </TableCell>
          <TableCell>{convertTimeFromWeekHoursToDayHours(item.end)}</TableCell>
          <TableCell>{item.storageAreaCode}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
