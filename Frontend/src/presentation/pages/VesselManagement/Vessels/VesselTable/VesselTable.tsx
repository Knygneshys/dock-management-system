import { EditSquare } from "@mui/icons-material";
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import type { Vessel } from "../../../../../domain/Types/entities/Vessel";

interface Props {
  vessels: Vessel[];
  onUpdateButtonClick: (vesselId: string) => void;
}

export default function VesselTable({ vessels, onUpdateButtonClick }: Props) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Imo</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Vessel Type</TableCell>
            <TableCell>Owner</TableCell>
            <TableCell>Operator</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vessels.map((vessel) => (
            <TableRow key={vessel.imo}>
              <TableCell>{vessel.imo}</TableCell>
              <TableCell>{vessel.name}</TableCell>
              <TableCell>{vessel.type.name}</TableCell>
              <TableCell>{vessel.owner.name}</TableCell>
              <TableCell>{vessel.operator.name}</TableCell>
              <TableCell>
                <IconButton
                  onClick={() => {
                    onUpdateButtonClick(vessel.imo);
                  }}
                >
                  <EditSquare />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
