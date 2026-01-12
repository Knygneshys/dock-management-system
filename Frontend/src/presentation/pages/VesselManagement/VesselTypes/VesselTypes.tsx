import { FilterAlt } from "@mui/icons-material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Box, IconButton, Typography } from "@mui/material";
import { useState } from "react";

import VesselTypeCreationDialog from "./VesselTypeCreationDialog/VesselTypeCreationDialog";
import VesselTypeSearchDialog from "./VesselTypeSearchDialog/VesselTypeSearchDialog";
import VesselTypeTable from "./VesselTypeTable/VesselTypeTable";
import VesselTypeUpdateDialog from "./VesselTypeUpdateDialog/VesselTypeUpdateDialog";
import type { VesselType } from "../../../../domain/Types/entities/VesselType";
import type { VesselTypeSearchQuery } from "../../../../application/vessel-type/queries/VesselTypeSearchQuery";
import { useCreateVesselTypeMutation } from "../../../state-management/mutations/vessel-type-mutations/useCreateVesselTypeMutation";
import { useSearchVesselTypesQuery } from "../../../state-management/queries/vessel-type-queries/useSearchVesselTypesQuery";

interface Props {
  vesselTypesFromDatabase: VesselType[];
}

export default function VesselTypes({ vesselTypesFromDatabase }: Props) {
  const [creationDialogIsOpen, setCreationDialogIsOpen] = useState(false);
  const [updateDialogIsOpen, setUpdateDialogIsOpen] = useState(false);
  const [searchDialogIsOpen, setSearchDialogIsOpen] = useState(false);
  const [
    codeOfCurrentlyUpdatingVesselType,
    setCodeOfCurrentlyUpdatingVesselType,
  ] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<VesselTypeSearchQuery | null>(
    null,
  );

  const createVesselTypeMutation = useCreateVesselTypeMutation();
  const searchVesselTypesQuery = useSearchVesselTypesQuery(searchQuery);

  const listCountZero = 0;

  const filteredVesselTypes = searchVesselTypesQuery?.data;

  const filteredVesselTypeListIsEmpty =
    filteredVesselTypes?.length === listCountZero ||
    filteredVesselTypes === undefined;

  const vesselTypes = filteredVesselTypeListIsEmpty
    ? vesselTypesFromDatabase
    : filteredVesselTypes;

  const onVesselTypeCreation = (vesselType: VesselType) => {
    createVesselTypeMutation.mutate(vesselType);
    handleCreationDialogClose();
  };

  const onVesselTypeSearch = (query: VesselTypeSearchQuery) => {
    setSearchQuery(query);
    handleSearchDialogClose();
  };

  const handleCreationDialogOpen = () => {
    setCreationDialogIsOpen(true);
  };

  const handleCreationDialogClose = () => {
    setCreationDialogIsOpen(false);
  };

  const handleUpdateDialogOpen = (vesselTypeCode: string) => {
    setCodeOfCurrentlyUpdatingVesselType(vesselTypeCode);
    setUpdateDialogIsOpen(true);
  };

  const handleUpdateDialogClose = () => {
    setUpdateDialogIsOpen(false);
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
          Vessel Types
        </Typography>
        <Box sx={{ width: "75%", textAlign: "right" }}>
          <IconButton
            data-testid="vessel-type-filter-dialog-button"
            onClick={handleSearchDialogOpen}
          >
            <FilterAlt />
          </IconButton>
          <IconButton
            onClick={handleCreationDialogOpen}
            data-testid="vessel-type-creation-dialog-button"
          >
            <AddCircleOutlineIcon />
          </IconButton>
        </Box>
      </Box>
      {vesselTypes ? (
        <VesselTypeTable
          vesselTypes={vesselTypes}
          onUpdateButtonClick={handleUpdateDialogOpen}
        />
      ) : (
        <Typography>No vessel types found!</Typography>
      )}
      <VesselTypeCreationDialog
        onSubmit={onVesselTypeCreation}
        isOpen={creationDialogIsOpen}
        handleClose={handleCreationDialogClose}
      />
      {updateDialogIsOpen && (
        <VesselTypeUpdateDialog
          isOpen={updateDialogIsOpen}
          handleClose={handleUpdateDialogClose}
          vesselTypeCode={codeOfCurrentlyUpdatingVesselType}
        />
      )}
      {searchDialogIsOpen && (
        <VesselTypeSearchDialog
          isOpen={searchDialogIsOpen}
          handleClose={handleSearchDialogClose}
          onSubmit={onVesselTypeSearch}
        />
      )}
    </Box>
  );
}
