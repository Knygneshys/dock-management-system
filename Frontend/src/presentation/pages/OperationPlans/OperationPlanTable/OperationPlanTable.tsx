import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { EditSquare } from "@mui/icons-material";
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { OperationPlan } from "../../../../domain/Types/entities/OperationPlan";

interface Props {
  opPlans: OperationPlan[];
  onUpdateButtonClick: (vvnCode: number) => void;
}

function OperationPlanTable({ opPlans, onUpdateButtonClick }: Props) {
  const formatDate = (date: Date) => {
    if (!date) return "-";

    const dateObj = typeof date === "string" ? new Date(date) : date;

    return new Intl.DateTimeFormat("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(dateObj);
  };
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>VVN Code</TableCell>
            <TableCell>Dock Code</TableCell>
            <TableCell>Start</TableCell>
            <TableCell>End</TableCell>
            <TableCell>Used Algorithm</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {opPlans.map((plan: OperationPlan) => {
            const lastElementIndex = plan.plannedOperations.length - 1;
            return (
              <TableRow key={plan.vvnCode}>
                <TableCell>{plan.vvnCode}</TableCell>
                <TableCell>{plan.dockCode}</TableCell>
                <TableCell>{formatDate(plan.start)}</TableCell>
                <TableCell>
                  {formatDate(plan.plannedOperations[lastElementIndex].end)}
                </TableCell>
                <TableCell>{plan.usedAlgorithm}</TableCell>
                <TableCell>{formatDate(plan.createdAt)}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      onUpdateButtonClick(plan.vvnCode);
                    }}
                  >
                    <EditSquare />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default OperationPlanTable;
