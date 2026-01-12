import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { UpdateIncidentTypeCommand } from "../../../../application/incident-type/command/UpdateIncidentTypeCommand";
import { useUpdateIncidentTypeMutation } from "../../../state-management/mutations/incident-type-mutations/useUpdateIncidentTypeMutation";
import { useFindIncidentTypeByCodeQuery } from "../../../state-management/queries/incident-type/useFindIncidentTypeByCodeQuery";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";
import { accentColor } from "../../../constants/colorscheme";
import IncidentTypeUpdateDialogForm from "./IncidentTypeUpdateDialogForm/IncidentTypeUpdateDialogForm";

type Props = {
  isOpen: boolean;
  handleClose: () => void;
  incidentTypeCode: string;
};

export default function IncidentTypeUpdateDialog({
  isOpen,
  handleClose,
  incidentTypeCode,
}: Props) {
  const dialogTitle = `Update Incident Type (Code: ${incidentTypeCode})`;
  const findIncidentTypeByIdQuery =
    useFindIncidentTypeByCodeQuery(incidentTypeCode);
  const updateIncidentTypeMutation =
    useUpdateIncidentTypeMutation(incidentTypeCode);

  const incidentType = findIncidentTypeByIdQuery?.data;

  const onSubmit = (command: UpdateIncidentTypeCommand) => {
    updateIncidentTypeMutation.mutate(command);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle sx={{ textAlign: "center" }}>{dialogTitle}</DialogTitle>
      <DialogContent>
        {incidentType && findIncidentTypeByIdQuery.fetchStatus === "idle" ? (
          <IncidentTypeUpdateDialogForm
            onSubmit={onSubmit}
            incidentType={incidentType}
          />
        ) : (
          <LoadingScreen />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ backgroundColor: accentColor }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
