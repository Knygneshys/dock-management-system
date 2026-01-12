import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import VesselUpdateForm from "./VesselUpdateForm/VesselUpdateForm";
import type { VesselType } from "../../../../../domain/Types/entities/VesselType";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";
import type { UpdateVesselCommand } from "../../../../../application/vessel/commands/UpdateVesselCommand";
import { useUpdateVesselMutation } from "../../../../state-management/mutations/vessel-mutations/useUpdateVesselMutation";
import { useGetAllCompaniesQuery } from "../../../../state-management/queries/company-queries/useGetAllCompaniesQuery";
import { useGetVesselByImoQuery } from "../../../../state-management/queries/vessel-queries/useGetVesselByImoQuery";
import { accentColor } from "../../../../constants/colorscheme";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  vesselImo: string;
  vesselTypes: VesselType[];
}

export default function VesselUpdateDialog({
  isOpen,
  handleClose,
  vesselImo,
  vesselTypes,
}: Props) {
  const dialogTitle = `Update Vessel (${vesselImo})`;
  const getVesselByImoQuery = useGetVesselByImoQuery(vesselImo);
  const updateVesselMutation = useUpdateVesselMutation(vesselImo);

  const vessel = getVesselByImoQuery?.data;

  const getAllCompaniesQuery = useGetAllCompaniesQuery();

  if (
    getAllCompaniesQuery.isLoading ||
    getAllCompaniesQuery?.data === undefined
  ) {
    return (
      <Dialog open={true}>
        <LoadingScreen />
      </Dialog>
    );
  }
  const onSubmit = (command: UpdateVesselCommand) => {
    updateVesselMutation.mutate(command);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle sx={{ textAlign: "center" }}>{dialogTitle}</DialogTitle>
      <DialogContent>
        {vessel && getVesselByImoQuery.fetchStatus === "idle" ? (
          <VesselUpdateForm
            vessel={vessel}
            onSubmit={onSubmit}
            companies={getAllCompaniesQuery?.data}
            vesselTypes={vesselTypes}
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
