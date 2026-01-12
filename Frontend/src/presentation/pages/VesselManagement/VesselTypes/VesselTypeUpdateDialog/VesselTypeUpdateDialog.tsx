import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";
import VesselTypeUpdateForm from "./VesselUpdateForm/VesselTypeUpdateForm";
import { useGetVesselTypeByIdQuery } from "../../../../state-management/queries/vessel-type-queries/useGetVesselTypeByIdQuery";
import { useUpdateVesselTypeMutation } from "../../../../state-management/mutations/vessel-type-mutations/useUpdateVesselTypeMutation";
import type { VesselType } from "../../../../../domain/Types/entities/VesselType";
import { accentColor } from "../../../../constants/colorscheme";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  vesselTypeCode: string;
}

export default function VesselTypeUpdateDialog({
  isOpen,
  handleClose,
  vesselTypeCode,
}: Props) {
  const dialogTitle = `Update Vessel Type (Code: ${vesselTypeCode})`;
  const getVesselTypeByIdQuery = useGetVesselTypeByIdQuery(vesselTypeCode);
  const updateVesselTypeMutation = useUpdateVesselTypeMutation(vesselTypeCode);

  const vesselType = getVesselTypeByIdQuery?.data;

  const onSubmit = (updatedVesselType: VesselType) => {
    updateVesselTypeMutation.mutate(updatedVesselType);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle sx={{ textAlign: "center" }}>{dialogTitle}</DialogTitle>
      <DialogContent>
        {vesselType && getVesselTypeByIdQuery.fetchStatus === "idle" ? (
          <VesselTypeUpdateForm vesselType={vesselType} onSubmit={onSubmit} />
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
