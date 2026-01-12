import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { VVE } from "../../../../domain/Types/entities/VVE";

interface Props {
  vves: VVE[];
  handleExecutedOperationDialogOpen: (code: number) => void;
}

export default function VVETable({
  vves,
  handleExecutedOperationDialogOpen,
}: Props) {
  const formatDateTime = (date: Date | string) => {
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return "Invalid Date";
      }
      return dateObj.toLocaleString();
    } catch {
      return "Invalid Date";
    }
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Code</TableCell>
            <TableCell>VVN Code</TableCell>
            <TableCell>Vessel IMO</TableCell>
            <TableCell>Arrival Time</TableCell>
            <TableCell>Creator Email</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vves &&
            vves.map((vve) => (
              <TableRow key={vve.code}>
                <TableCell>{vve.code}</TableCell>
                <TableCell>{vve.vvnCode}</TableCell>
                <TableCell>{vve.vesselImo}</TableCell>
                <TableCell>{formatDateTime(vve.arrivalTime)}</TableCell>
                <TableCell>{vve.creatorUserEmail}</TableCell>
                <TableCell>{vve.status}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleExecutedOperationDialogOpen(vve.code)}
                  >
                    <AddToPhotosIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
