import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import type { PlannedOperation } from "../../../../../domain/Types/entities/PlannedOperation";
import type { ContainerPosition } from "../../../../../domain/Types/value-objects/ContainerPosition";
import { minutesToHoursAndMinutesString } from "../../../../utils/timeUtils";

interface Props {
  plannedOperations: PlannedOperation[];
}

const formatContainerPosition = (containerPosition: ContainerPosition) => {
  return `Bay: ${containerPosition.bay} Row: ${containerPosition.row} Tier: ${containerPosition.tier}`;
};

export default function PlannedOperationTable({ plannedOperations }: Props) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Start</TableCell>
          <TableCell>End</TableCell>
          <TableCell>From</TableCell>
          <TableCell>To</TableCell>
          <TableCell>ContainerId</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {plannedOperations.map((op, index) => {
          return (
            <TableRow key={index}>
              <TableCell>
                {minutesToHoursAndMinutesString(Number(op.start) % (24 * 60))}
              </TableCell>
              <TableCell>
                {minutesToHoursAndMinutesString(Number(op.end) % (24 * 60))}
              </TableCell>
              <TableCell>{formatContainerPosition(op.from)}</TableCell>
              <TableCell>{formatContainerPosition(op.to)}</TableCell>
              <TableCell>{op.containerId}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
