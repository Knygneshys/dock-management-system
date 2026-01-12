import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Box, IconButton, Typography } from "@mui/material";
import { useState } from "react";

import SARCreationDialog from "./SARCreationDialog/SARCreationDialog";
import SARTable from "./SARTable/SARTable";
import type { ShippingAgentRepresentative } from "../../../domain/Types/entities/ShippingAgentRepresentative";
import { useCreateSarMutation } from "../../state-management/mutations/sar-mutations/useCreateSarMutation";
import { useGetAllSarsQuery } from "../../state-management/queries/sar-queries/useGetAllSarQuery";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";

const EMPTY_ARRAY_LENGTH = 0;

export interface Props {
  sarsFromDatabase?: ShippingAgentRepresentative[];
}

const SARs = ({ sarsFromDatabase }: Props = {}) => {
  const [sarDialogIsOpen, setSarDialogIsOpen] = useState(false);

  const createSarMutation = useCreateSarMutation();
  const getAllSarsQuery = useGetAllSarsQuery();

  const sars = sarsFromDatabase ?? getAllSarsQuery?.data;

  if (!sarsFromDatabase && (getAllSarsQuery.isLoading || sars === undefined)) {
    return <LoadingScreen />;
  }

  const onSarCreation = async (sar: ShippingAgentRepresentative) => {
    createSarMutation.mutate(sar);
    handleCreationDialogClose();
  };

  const handleCreationDialogOpen = () => {
    setSarDialogIsOpen(true);
  };

  const handleCreationDialogClose = () => {
    setSarDialogIsOpen(false);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography fontWeight={"bold"} sx={{ width: "25%" }}>
          SARs
        </Typography>
        <Box sx={{ width: "75%", textAlign: "right" }}>
          <IconButton
            onClick={handleCreationDialogOpen}
            data-testid="sar-creation-dialog-button"
          >
            <AddCircleOutlineIcon />
          </IconButton>
        </Box>
      </Box>
      {sars && sars.length > EMPTY_ARRAY_LENGTH ? (
        <SARTable sars={sars} />
      ) : (
        <Typography>No SARs found!</Typography>
      )}
      <SARCreationDialog
        onSubmit={onSarCreation}
        isOpen={sarDialogIsOpen}
        handleClose={handleCreationDialogClose}
      />
    </Box>
  );
};

export default SARs;
