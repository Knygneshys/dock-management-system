import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import type { ShippingAgentRepresentative } from "../../../../domain/Types/entities/ShippingAgentRepresentative";

interface Props {
  sars: ShippingAgentRepresentative[];
}

export default function SARTable({ sars }: Props) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Company Code</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sars &&
            sars.map((sar) => (
              <TableRow key={sar.email}>
                <TableCell>{sar.name}</TableCell>
                <TableCell>{sar.email}</TableCell>
                <TableCell>{sar.companyCode}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
