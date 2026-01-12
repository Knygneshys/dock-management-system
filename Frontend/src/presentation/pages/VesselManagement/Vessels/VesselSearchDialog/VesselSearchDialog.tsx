import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

import VesselSearchForm from "./VesselSearchForm/VesselSearchForm";
import type { VesselSearchQuery } from "../../../../../application/vessel/queries/VesselSearchQuery";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";
import { useGetAllCompaniesQuery } from "../../../../state-management/queries/company-queries/useGetAllCompaniesQuery";
import { accentColor } from "../../../../constants/colorscheme";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  onSubmit: (vesselSearchQuery: VesselSearchQuery) => void;
}

export default function VesselSearchDialog({ isOpen, handleClose, onSubmit }: Props) {
  const dialogTitle = "Search for Vessel";

  const getAllCompaniesQuery = useGetAllCompaniesQuery();

  if (getAllCompaniesQuery.isLoading || getAllCompaniesQuery?.data === undefined) {
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
        <VesselSearchForm onSubmit={onSubmit} companies={getAllCompaniesQuery?.data} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ backgroundColor: accentColor }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
