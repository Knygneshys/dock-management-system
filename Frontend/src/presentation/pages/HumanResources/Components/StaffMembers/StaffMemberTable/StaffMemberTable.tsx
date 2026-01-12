import EditSquareIcon from "@mui/icons-material/EditSquare";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import ScheduleIcon from "@mui/icons-material/Schedule";
import WorkIcon from "@mui/icons-material/Work";
import {
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  type ChipProps,
} from "@mui/material";

import ResourceQualifications from "../../../../../shared/QualificationDisplayMultiline/QualificationDisplayMultiline";
import type { StaffMember } from "../../../../../../domain/Types/entities/StaffMember";
import { StaffStatus } from "../../../../../../domain/Enums/staffStatus";

type StaffMembersWrapper = {
  data: StaffMember[];
};

interface StaffMemberTableProps {
  staffMembers: StaffMembersWrapper;
  isActive: boolean;
  onUpdateButtonClick?: (staff: StaffMember) => void;
  onStatusChangeClick: (mecanographicNumber: number) => void;
  onOperationalWindowsClick?: (staff: StaffMember) => void;
  onQualificationsClick?: (staff: StaffMember) => void;
}

const StaffMemberTable: React.FC<StaffMemberTableProps> = ({
  staffMembers,
  isActive,
  onUpdateButtonClick,
  onStatusChangeClick,
  onOperationalWindowsClick,
  onQualificationsClick,
}) => {
  const getStatusColor = (status: StaffStatus): ChipProps["color"] => {
    switch (status) {
      case StaffStatus.AVAILABLE:
        return "success";
      case StaffStatus.UNAVAILABLE:
        return "error";
      case StaffStatus.ON_LEAVE:
        return "warning";
      case StaffStatus.UNDER_TRAINING:
        return "info";
      default:
        return "default";
    }
  };

  const formatStatus = (status: StaffStatus): string => {
    switch (status) {
      case StaffStatus.AVAILABLE:
        return "Available";
      case StaffStatus.UNAVAILABLE:
        return "Unavailable";
      case StaffStatus.ON_LEAVE:
        return "On Leave";
      case StaffStatus.UNDER_TRAINING:
        return "Under Training";
      default:
        return String(status);
    }
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Mecanographic Number</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Qualification(s)</TableCell>
            <TableCell>Operational Window</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {staffMembers.data &&
            staffMembers.data.map((staff: StaffMember) => (
              <TableRow key={staff.mecanographicNumber}>
                <TableCell>{staff.mecanographicNumber}</TableCell>
                <TableCell>{staff.name}</TableCell>
                <TableCell>{staff.email}</TableCell>
                <TableCell>{staff.phone}</TableCell>
                <TableCell>
                  <ResourceQualifications
                    qualifications={staff.qualifications}
                  />
                </TableCell>
                <TableCell>
                  {staff.operationalWindows && staff.operationalWindows.length
                    ? `${staff.operationalWindows.length} window(s)`
                    : "None"}
                </TableCell>
                <TableCell>
                  <Chip
                    label={formatStatus(staff.status)}
                    color={getStatusColor(staff.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() =>
                      onStatusChangeClick(staff.mecanographicNumber)
                    }
                    title={
                      isActive
                        ? "Deactivate Staff Member"
                        : "Activate Staff Member"
                    }
                  >
                    {isActive ? <PersonOffIcon /> : <PersonAddIcon />}
                  </IconButton>

                  {isActive && (
                    <>
                      <IconButton
                        onClick={() => onUpdateButtonClick?.(staff)}
                        title="Edit Staff Member"
                      >
                        <EditSquareIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => onOperationalWindowsClick?.(staff)}
                        title="Manage Operational Windows"
                      >
                        <ScheduleIcon />
                      </IconButton>

                      <IconButton
                        onClick={() => onQualificationsClick?.(staff)}
                        title="Manage Qualifications"
                      >
                        <WorkIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StaffMemberTable;
