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
import type { DockRecord } from "../../../../../domain/Types/entities/DockRecord";

interface Props {
  dockRecords: DockRecord[];
  onUpdateButtonClick: (code: string) => void;
}

export default function DockRecordTable({
  dockRecords,
  onUpdateButtonClick,
}: Props) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Code</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Length</TableCell>
            <TableCell>Depth</TableCell>
            <TableCell>Max Draft</TableCell>
            <TableCell>Vessel Types</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dockRecords.map((dockRecord: DockRecord) => (
            <TableRow key={dockRecord.code ?? Math.random()}>
              <TableCell>{dockRecord.code}</TableCell>
              <TableCell>{dockRecord.name}</TableCell>
              <TableCell>{dockRecord.location}</TableCell>
              <TableCell>{dockRecord.length}</TableCell>
              <TableCell>{dockRecord.depth}</TableCell>
              <TableCell>{dockRecord.maxDraft}</TableCell>

              <TableCell sx={{ color: "text.secondary", fontSize: "0.9em" }}>
                {Array.isArray(dockRecord.vesselTypeCodes) ? (
                  dockRecord.vesselTypeCodes.join(", ")
                ) : (
                  <em>No vessel types</em>
                )}
              </TableCell>

              <TableCell>
                <IconButton
                  onClick={() => {
                    onUpdateButtonClick(dockRecord.code);
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
