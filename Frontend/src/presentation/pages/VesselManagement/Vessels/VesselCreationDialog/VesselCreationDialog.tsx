import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";
import VesselCreationForm from "./VesselCreationForm/VesselCreationForm";
import type { VesselType } from "../../../../../domain/Types/entities/VesselType";
import type { CreateVesselCommand } from "../../../../../application/vessel/commands/CreateVesselCommand";
import { useGetAllCompaniesQuery } from "../../../../state-management/queries/company-queries/useGetAllCompaniesQuery";
import { accentColor } from "../../../../constants/colorscheme";

interface Props {
  vesselTypes: VesselType[];
  isOpen: boolean;
  handleClose: () => void;
  onSubmit: (vessel: CreateVesselCommand) => void;
}

export default function VesselCreationDialog({
  vesselTypes,
  isOpen,
  handleClose,
  onSubmit,
}: Props) {
  const dialogTitle = "Create Vessel";

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

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle sx={{ textAlign: "center" }}>{dialogTitle}</DialogTitle>
      <DialogContent>
        <VesselCreationForm
          vesselTypes={vesselTypes}
          onSubmit={onSubmit}
          companies={getAllCompaniesQuery?.data}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ backgroundColor: accentColor }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
