import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { VVN } from "../../../../domain/Types/entities/VVN";

interface Props {
  vvns: VVN[];
  onRegenerateClick: (vvn: VVN) => void;
}

export default function MissingPlansTable({ vvns, onRegenerateClick }: Props) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Code</TableCell>
            <TableCell>Vessel</TableCell>
            <TableCell>ETA</TableCell>
            <TableCell>ETD</TableCell>
            <TableCell>Company</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vvns &&
            vvns.map((vvn) => (
              <TableRow key={vvn.code}>
                <TableCell>{vvn.code}</TableCell>
                <TableCell>{vvn.vessel.name}</TableCell>
                <TableCell>{formatDate(vvn.eta)}</TableCell>
                <TableCell>{formatDate(vvn.etd)}</TableCell>
                <TableCell>{vvn.shippingAgentRepresentative.companyCode}</TableCell>
                <TableCell>{vvn.status}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => onRegenerateClick(vvn)} title="Regenerate plans for this day">
                    <RefreshIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
