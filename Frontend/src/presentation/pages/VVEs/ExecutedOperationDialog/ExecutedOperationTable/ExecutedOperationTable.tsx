import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { ExecutedOperation } from "../../../../../domain/Types/entities/ExecutedOperation";
import { ContainerPosition } from "../../../../../domain/Types/value-objects/ContainerPosition";

type Props = {
  executedOperations: ExecutedOperation[];
};

export default function ExecutedOperationTable({ executedOperations }: Props) {
  const formatContainerPosition = (pos: ContainerPosition) => {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <Typography noWrap variant="caption">
          Bay: {pos.bay}
        </Typography>
        <Typography noWrap variant="caption">
          Tier: {pos.tier}
        </Typography>
        <Typography noWrap variant="caption">
          Row: {pos.row}
        </Typography>
      </Box>
    );
  };

  if (executedOperations.length === 0) {
    return <Typography>There are no executed operations!</Typography>;
  }
  {
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Start</TableCell>
              <TableCell>End</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Container Id</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {executedOperations.map((op: ExecutedOperation, index: number) => {
              const startDate = new Date(op.start);
              const endDate = new Date(op.end);

              return (
                <TableRow key={index}>
                  <TableCell>{startDate.toLocaleString()}</TableCell>
                  <TableCell>{endDate.toLocaleString()}</TableCell>
                  <TableCell>{formatContainerPosition(op.from)}</TableCell>
                  <TableCell>{formatContainerPosition(op.to)}</TableCell>
                  <TableCell>
                    <Typography noWrap>{op.containerId}</Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}
