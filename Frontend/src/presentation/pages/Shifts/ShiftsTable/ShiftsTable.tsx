import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import type { Shift } from "../../../../domain/Types/entities/Shift";

interface Props {
  shifts: Shift[];
}

export default function ShiftsTable({ shifts }: Props) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>From</TableCell>
            <TableCell>To</TableCell>
            <TableCell>Resource Code</TableCell>
            <TableCell>Staff Number</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {shifts.map((shift, index) => (
            <TableRow key={index}>
              <TableCell>{shift.from}</TableCell>
              <TableCell>{shift.to}</TableCell>
              <TableCell>{shift.resourceCode}</TableCell>
              <TableCell>{shift.staffMNumber}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
