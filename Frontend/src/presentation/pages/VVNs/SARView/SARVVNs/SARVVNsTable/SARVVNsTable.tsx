import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import VVNStatusChip from "../../../shared/VVNStatusChip/VVNStatusChip";
import type { VVN } from "../../../../../../domain/Types/entities/VVN";
import { VVN_STATUS } from "../../../../../../domain/Enums/vvnStatus";

interface Props {
  vvns: VVN[];
  onUpdateButtonClick: (vvn: VVN) => void;
}

function SARVVNTable({ vvns, onUpdateButtonClick }: Props) {
  const START_SLICE = 0;
  const END_SLICE = -3;
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Code</TableCell>
            <TableCell>ETA</TableCell>
            <TableCell>ETD</TableCell>
            <TableCell>Vessel</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vvns.map((vvn) => (
            <TableRow key={vvn.code}>
              <TableCell>{vvn.code}</TableCell>
              <TableCell>
                {new Date(vvn.eta)
                  .toLocaleString()
                  .slice(START_SLICE, END_SLICE)}
              </TableCell>
              <TableCell>
                {new Date(vvn.etd)
                  .toLocaleString()
                  .slice(START_SLICE, END_SLICE)}
              </TableCell>
              <TableCell>{vvn.vessel.name}</TableCell>
              <TableCell>
                {vvn.status === VVN_STATUS.INPROGRESS && (
                  <VVNStatusChip
                    status={vvn.status}
                    onClick={() => onUpdateButtonClick(vvn)}
                  />
                )}
                {vvn.status !== VVN_STATUS.INPROGRESS && (
                  <VVNStatusChip status={vvn.status} />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default SARVVNTable;
