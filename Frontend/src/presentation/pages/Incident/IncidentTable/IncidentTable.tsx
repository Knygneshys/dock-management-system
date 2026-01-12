import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material";
import { Incident } from "../../../../domain/Types/entities/Incident";
import { IncidentStatus } from "../../../../domain/Enums/incidentStatus";
import { AttachFile, CheckCircleOutlineOutlined, LinkOff } from "@mui/icons-material";
import { VVE } from "../../../../domain/Types/entities/VVE";

interface Props {
  incidents: Incident[];
  onResolveButtonClick: (code: string) => void;
  onAssociateVVEButtonClick: (code: string) => void;
  onDetachVVEButtonClick: (code: string, vves: VVE[]) => void;
}

export default function IncidentTable({
  incidents,
  onResolveButtonClick,
  onAssociateVVEButtonClick,
  onDetachVVEButtonClick
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
            <TableCell>Type</TableCell>
            <TableCell>Start</TableCell>
            <TableCell>End</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {incidents.map((inc) => (
            <TableRow key={inc.code}>
              <TableCell>{inc.code}</TableCell>
              <TableCell>{inc.type.name}</TableCell>
              <TableCell>{formatDateTime(inc.startISO)}</TableCell>
              <TableCell>{inc.endISO ? formatDateTime(inc.endISO) : "-"}</TableCell>
              <TableCell>{inc.status}</TableCell>
              <TableCell>
                {inc.status !== IncidentStatus.Resolved && (
                  <Tooltip title="Resolve" placement="top" arrow>
                    <IconButton
                      onClick={() => {
                        onResolveButtonClick(inc.code);
                      }}
                    >
                      <CheckCircleOutlineOutlined color="success" />
                    </IconButton>
                  </Tooltip>
                )}

                <Tooltip title="Associate VVE" placement="top" arrow>
                  <IconButton
                    onClick={() => {
                      onAssociateVVEButtonClick(inc.code);
                    }}
                  >
                    <AttachFile color="warning" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Detach VVE" placement="top" arrow>
                  <IconButton
                    onClick={() => {
                      onDetachVVEButtonClick(inc.code, inc.afectedVVEs);
                    }}
                  >
                    <LinkOff color="error" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
