import { Chip } from "@mui/material";
import { VVN_STATUS } from "../../../../../domain/Enums/vvnStatus";

interface Props {
  status: string;
  onClick?: () => void;
}

export default function VVNStatusChip({ status, onClick }: Props) {
  const chipColor = (status: string) => {
    switch (status) {
      case VVN_STATUS.INPROGRESS:
        return "warning";
      case VVN_STATUS.APPROVED:
        return "success";
      case VVN_STATUS.REJECTED:
        return "error";
      case VVN_STATUS.SUBMITTED:
        return "success";
      case VVN_STATUS.WITHDRAWN:
        return "error";
      default:
        return "primary";
    }
  };
  return <Chip onClick={onClick} label={status} color={chipColor(status)} />;
}
