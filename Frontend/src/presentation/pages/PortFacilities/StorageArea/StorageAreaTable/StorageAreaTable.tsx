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
import type { StorageArea } from "../../../../../domain/Types/entities/StorageArea";

interface Props {
  storageAreas: StorageArea[];
  onUpdateButtonClick: (strageAreaCode: string) => void;
}

export default function StorageAreaTable({
  storageAreas,
  onUpdateButtonClick,
}: Props) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Code</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Max Capacity</TableCell>
            <TableCell>Current Occupancy</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {storageAreas.map((storageArea) => (
            <TableRow key={storageArea.code ?? Math.random()}>
              <TableCell>{storageArea.code}</TableCell>
              <TableCell>{storageArea.type}</TableCell>
              <TableCell>{storageArea.location}</TableCell>
              <TableCell>{storageArea.maxCapacity}</TableCell>
              <TableCell>{storageArea.currentOccupancy}</TableCell>

              <TableCell>
                <IconButton
                  onClick={() => {
                    onUpdateButtonClick(storageArea.code);
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
