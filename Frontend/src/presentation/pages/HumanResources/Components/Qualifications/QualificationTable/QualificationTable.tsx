import EditSquareIcon from "@mui/icons-material/EditSquare";
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import type { Qualification } from "../../../../../../domain/Types/entities/Qualification";

interface Props {
  qualifications: Qualification[];
  onUpdateButtonClick: (qualificationCode: string) => void;
}

export default function QualificationsTable({
  qualifications,
  onUpdateButtonClick,
}: Props) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Code</TableCell>
            <TableCell>Name</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {qualifications &&
            qualifications.map((qualification) => (
              <TableRow key={qualification.code}>
                <TableCell>{qualification.code}</TableCell>
                <TableCell>{qualification.name}</TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => {
                      onUpdateButtonClick(qualification.code);
                    }}
                  >
                    <EditSquareIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
