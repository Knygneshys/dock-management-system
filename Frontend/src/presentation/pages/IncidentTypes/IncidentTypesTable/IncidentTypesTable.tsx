import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { IncidentType } from "../../../../domain/Types/entities/IncidentType";
import { EditSquare } from "@mui/icons-material";

type Props = {
  incidentTypes: IncidentType[];
  onUpdateButtonClick: (code: string) => void;
};

export default function IncidentTypesTable({
  incidentTypes,
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
            <TableCell>Severity</TableCell>
            <TableCell>Parent Code</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {incidentTypes.map((incidentType: IncidentType) => (
            <TableRow key={incidentType.code}>
              <TableCell>{incidentType.code}</TableCell>
              <TableCell>{incidentType.name}</TableCell>
              <TableCell>{incidentType.description}</TableCell>
              <TableCell>{incidentType.severity}</TableCell>
              <TableCell>{incidentType.parentIncidentTypeCode}</TableCell>
              <TableCell>
                <IconButton
                  onClick={() => {
                    onUpdateButtonClick(incidentType.code);
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
