import { EditSquare } from "@mui/icons-material";
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import type { VesselType } from "../../../../../domain/Types/entities/VesselType";

interface Props {
  vesselTypes: VesselType[];
  onUpdateButtonClick: (vesselTypeCode: string) => void;
}

export default function VesselTypeTable({
  vesselTypes,
  onUpdateButtonClick,
}: Props) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Code</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Capacity</TableCell>
            <TableCell>Max Rows</TableCell>
            <TableCell>Max Bays</TableCell>
            <TableCell>Max Tiers</TableCell>
            <TableCell>Length</TableCell>
            <TableCell>Draft</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vesselTypes.map((vesselType: VesselType) => (
            <TableRow key={vesselType.code}>
              <TableCell>{vesselType.code}</TableCell>
              <TableCell>{vesselType.name}</TableCell>
              <TableCell>{vesselType.description}</TableCell>
              <TableCell>{vesselType.capacity}</TableCell>
              <TableCell>{vesselType.maxRows}</TableCell>
              <TableCell>{vesselType.maxBays}</TableCell>
              <TableCell>{vesselType.maxTiers}</TableCell>
              <TableCell>{vesselType.length}</TableCell>
              <TableCell>{vesselType.draft}</TableCell>
              <TableCell>
                <IconButton
                  onClick={() => {
                    onUpdateButtonClick(vesselType.code);
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
