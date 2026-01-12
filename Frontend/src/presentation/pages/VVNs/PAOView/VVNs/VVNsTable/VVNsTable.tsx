import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useState } from "react";

import VVNStatusChip from "../../../shared/VVNStatusChip/VVNStatusChip";
import VVNDialog from "../VVNDialog/VVNDialog";
import type { VVN } from "../../../../../../domain/Types/entities/VVN";

interface Props {
  vvns: VVN[];
}

function VVNsTable({ vvns }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // eslint-disable-next-line no-magic-numbers
  const [selectedVvn, setSelectedVvn] = useState(vvns[0] || null);
  const handleVvnSelect = (vvn: VVN) => {
    setSelectedVvn(vvn);
    setIsDialogOpen(true);
  };
  const START_SLICE = 0;
  const END_SLICE = -3;
  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };
  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>ETA</TableCell>
              <TableCell>ETD</TableCell>
              <TableCell>Vessel</TableCell>
              <TableCell>Representative</TableCell>
              <TableCell>Company</TableCell>
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
                <TableCell>{vvn.shippingAgentRepresentative.name}</TableCell>
                <TableCell>
                  {vvn.shippingAgentRepresentative.companyCode}
                </TableCell>
                <TableCell>
                  <VVNStatusChip
                    status={vvn.status}
                    onClick={() => handleVvnSelect(vvn)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <VVNDialog
        vvn={selectedVvn}
        open={isDialogOpen}
        onClose={handleDialogClose}
      />
    </>
  );
}

export default VVNsTable;
