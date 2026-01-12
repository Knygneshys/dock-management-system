import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import type { StockItem } from "../../../../domain/Types/entities/StockItem";

interface Props {
  stockItems: StockItem[];
}

function StockItemsTable({ stockItems }: Props) {
  const START_SLICE = 0;
  const END_SLICE = -3;
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Container ISO</TableCell>
            <TableCell>From</TableCell>
            <TableCell>To</TableCell>
            <TableCell>Available Since</TableCell>
            <TableCell>Available Until</TableCell>
            <TableCell>Storage</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stockItems.map((item) => (
            <TableRow key={item.containerISO}>
              <TableCell>{item.containerISO}</TableCell>
              <TableCell>{item.from}</TableCell>
              <TableCell>{item.to}</TableCell>
              <TableCell>
                {new Date(item.availableSince)
                  .toLocaleString()
                  .slice(START_SLICE, END_SLICE)}
              </TableCell>
              <TableCell>
                {new Date(item.availableUntil)
                  .toLocaleString()
                  .slice(START_SLICE, END_SLICE)}
              </TableCell>
              <TableCell>{item.storageArea.code}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default StockItemsTable;
