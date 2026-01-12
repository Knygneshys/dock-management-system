import { FilterAlt } from "@mui/icons-material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Box, IconButton, Typography } from "@mui/material";
import { useState } from "react";

import VesselCreationDialog from "./VesselCreationDialog/VesselCreationDialog";
import VesselSearchDialog from "./VesselSearchDialog/VesselSearchDialog";
import VesselTable from "./VesselTable/VesselTable";
import VesselUpdateDialog from "./VesselUpdateDialog/VesselUpdateDialog";
import type { VesselType } from "../../../../domain/Types/entities/VesselType";
import type { VesselSearchQuery } from "../../../../application/vessel/queries/VesselSearchQuery";
import { useCreateVesselMutation } from "../../../state-management/mutations/vessel-mutations/useCreateVesselMutation";
import type { CreateVesselCommand } from "../../../../application/vessel/commands/CreateVesselCommand";
import { useSearchVesselQuery } from "../../../state-management/queries/vessel-queries/useSearchVesselQuery";
import { useGetAllVesselsQuery } from "../../../state-management/queries/vessel-queries/useGetAllVesselsQuery";

interface Props {
  vesselTypes: VesselType[];
}

export default function Vessels({ vesselTypes }: Props) {
  const [creationDialogIsOpen, setCreationDialogIsOpen] = useState(false);
  const [updateDialogIsOpen, setUpdateDialogIsOpen] = useState(false);
  const [searchDialogIsOpen, setSearchDialogIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<VesselSearchQuery | null>(
    null,
  );
  const [imoOfCurrentlyUpdatingVessel, setImoOfCurrentlyUpdatingVessel] =
    useState<string | null>(null);

  const getAllVesselQuery = useGetAllVesselsQuery();
  const createVesselMutation = useCreateVesselMutation();

  const searchVesselQuery = useSearchVesselQuery(searchQuery);

  const listCountZero = 0;

  const filteredVessels = searchVesselQuery?.data;

  const filteredVesselListIsEmpty =
    filteredVessels?.length === listCountZero || filteredVessels === undefined;

  const vessels = filteredVesselListIsEmpty
    ? getAllVesselQuery?.data
    : filteredVessels;

  const onVesselCreation = (vessel: CreateVesselCommand) => {
    createVesselMutation.mutate(vessel);
    handleCreationDialogClose();
  };

  const handleCreationDialogOpen = () => {
    setCreationDialogIsOpen(true);
  };

  const handleCreationDialogClose = () => {
    setCreationDialogIsOpen(false);
  };

  const handleUpdateDialogOpen = (vesselImo: string) => {
    setImoOfCurrentlyUpdatingVessel(vesselImo);
    setUpdateDialogIsOpen(true);
  };

  const handleUpdateDialogClose = () => {
    setUpdateDialogIsOpen(false);
  };

  const onVesselSearch = (query: VesselSearchQuery) => {
    setSearchQuery(query);
    handleSearchDialogClose();
  };

  const handleSearchDialogOpen = () => {
    setSearchDialogIsOpen(true);
  };

  const handleSearchDialogClose = () => {
    setSearchDialogIsOpen(false);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography fontWeight={"bold"} sx={{ width: "25%" }}>
          Vessels
        </Typography>
        <Box sx={{ width: "75%", textAlign: "right" }}>
          <IconButton onClick={handleSearchDialogOpen}>
            <FilterAlt />
          </IconButton>
          <IconButton
            data-testid="vessel-creation-dialog-button"
            onClick={handleCreationDialogOpen}
          >
            <AddCircleOutlineIcon />
          </IconButton>
        </Box>
      </Box>
      {vessels ? (
        <VesselTable
          vessels={vessels}
          onUpdateButtonClick={handleUpdateDialogOpen}
        />
      ) : (
        <Typography>No vessels found!</Typography>
      )}
      {creationDialogIsOpen && (
        <VesselCreationDialog
          vesselTypes={vesselTypes}
          onSubmit={onVesselCreation}
          isOpen={creationDialogIsOpen}
          handleClose={handleCreationDialogClose}
        />
      )}
      {updateDialogIsOpen && imoOfCurrentlyUpdatingVessel && (
        <VesselUpdateDialog
          vesselTypes={vesselTypes}
          isOpen={updateDialogIsOpen}
          handleClose={handleUpdateDialogClose}
          vesselImo={imoOfCurrentlyUpdatingVessel}
        />
      )}
      {searchDialogIsOpen && (
        <VesselSearchDialog
          isOpen={searchDialogIsOpen}
          handleClose={handleSearchDialogClose}
          onSubmit={onVesselSearch}
        />
      )}
    </Box>
  );
}
