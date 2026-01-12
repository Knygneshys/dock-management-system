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
import { CompTask } from "../../../../domain/Types/entities/CompTask";

interface Props {
  compTasks: CompTask[];
  onUpdateButtonClick: (taskCode: string) => void;
}

export default function CompTaskTable({
  compTasks,
  onUpdateButtonClick,
}: Props) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Code</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>VVE Code</TableCell>
            <TableCell>Team</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Start</TableCell>
            <TableCell>End</TableCell>
            <TableCell>Impact on Operations</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {compTasks &&
            compTasks.map((task) => (
              <TableRow key={task.code}>
                <TableCell>{task.code}</TableCell>
                <TableCell>{task.categoryCode}</TableCell>
                <TableCell>{task.vveCode}</TableCell>
                <TableCell>{task.team}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>{formatDate(task.start)}</TableCell>
                <TableCell>{task.end ? formatDate(task.end) : "N/A"}</TableCell>
                <TableCell>{task.impactOnOperations ? "Yes" : "No"}</TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => {
                      onUpdateButtonClick(task.code!);
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