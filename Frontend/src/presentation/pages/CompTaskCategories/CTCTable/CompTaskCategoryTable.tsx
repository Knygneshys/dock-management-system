import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material";
import { CompTaskCategory } from "../../../../domain/Types/entities/CompTaskCategory";

interface Props {
  categories: CompTaskCategory[];
  onUpdateButtonClick?: (code: string) => void;
  onDeleteButtonClick?: (code: string, name: string) => void;
  deleteDisabled?: boolean;
}

export default function CompTaskCategoryTable({ categories }: Props) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Code</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Default Delay</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {categories.map((ctc) => (
            <TableRow key={ctc.code ?? ctc.name}>
              <TableCell>{ctc.code ?? "-"}</TableCell>
              <TableCell>{ctc.name}</TableCell>

              <TableCell sx={{ color: "text.secondary", fontSize: "0.9em" }}>{ctc.description}</TableCell>

              <TableCell sx={{ color: "text.secondary", fontSize: "0.9em" }}>
                {ctc.defaultDelay ? `${ctc.defaultDelay.hour}h ${ctc.defaultDelay.minute}m` : <em>—</em>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
