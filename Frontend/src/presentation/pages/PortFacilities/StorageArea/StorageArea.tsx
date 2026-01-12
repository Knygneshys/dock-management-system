import { FilterAlt } from "@mui/icons-material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Box, IconButton, Typography } from "@mui/material";
import { useState } from "react";

import { useCreateStorageAreaMutation } from "../../../state-management/mutations/storage-area-mutations/useCreateStorageAreaMutation";
import { useSearchStorageAreasQuery } from "../../../state-management/queries/storage-area-queries/useSearchStorageAreasQuery";
import StorageAreaCreationDialog from "./StorageAreaCreationDialog/StorageAreaCreationDialog";
import StorageAreaSearchDialog from "./StorageAreaSearchDialog/StorageAreaSearchDialog";
import StorageAreaTable from "./StorageAreaTable/StorageAreaTable";
import StorageAreaUpdateDialog from "./StorageAreaUpdateDialog/StorageAreaUpdateDialog";
import type { StorageAreaSearchQuery } from "../../../../application/storage-area/queries/storageAreaSearchQuery";
import type { CreateStorageAreaCommand } from "../../../../application/storage-area/commands/CreateStorageAreaCommand";
import type { StorageArea } from "../../../../domain/Types/entities/StorageArea";

export interface Props {
  storageAreasFromDatabase: StorageArea[];
}

const StorageAreas = ({ storageAreasFromDatabase }: Props) => {
  const [creationDialogIsOpen, setCreationDialogIsOpen] = useState(false);
  const [updateDialogIsOpen, setUpdateDialogIsOpen] = useState(false);
  const [searchDialogIsOpen, setSearchDialogIsOpen] = useState(false);
  const [
    codeOfCurrentlyUpdatingStorageArea,
    setCodeOfCurrentlyUpdatingStorageArea,
  ] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<StorageAreaSearchQuery | null>(
    null
  );

  const createStorageAreaMutation = useCreateStorageAreaMutation();
  const searchStorageAreasQuery = useSearchStorageAreasQuery(searchQuery);

  const listCountZero = 0;

  const filteredStorageAreas = searchStorageAreasQuery?.data;

  const filteredStorageAreaListIsEmpty =
    filteredStorageAreas?.length === listCountZero ||
    filteredStorageAreas === undefined;

  const storageAreas = filteredStorageAreaListIsEmpty
    ? storageAreasFromDatabase
    : filteredStorageAreas;

  const onStorageAreaCreation = (command: CreateStorageAreaCommand) => {
    createStorageAreaMutation.mutate(command);
    handleCreationDialogClose();
  };

  const onStorageAreaSearch = (query: StorageAreaSearchQuery) => {
    setSearchQuery(query);
    handleSearchDialogClose();
  };

  const handleCreationDialogOpen = () => {
    setCreationDialogIsOpen(true);
  };

  const handleCreationDialogClose = () => {
    setCreationDialogIsOpen(false);
  };

  const handleUpdateDialogOpen = (storageAreaCode: string) => {
    setCodeOfCurrentlyUpdatingStorageArea(storageAreaCode);
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
          Storage Areas
        </Typography>
        <Box sx={{ width: "75%", textAlign: "right" }}>
          <IconButton
            data-testid="storage-area-filter-dialog-button"
            onClick={handleSearchDialogOpen}
          >
            <FilterAlt />
          </IconButton>
          <IconButton
            onClick={handleCreationDialogOpen}
            data-testid="storage-area-creation-dialog-button"
          >
            <AddCircleOutlineIcon />
          </IconButton>
        </Box>
      </Box>
      {storageAreas ? (
        <StorageAreaTable
          storageAreas={storageAreas}
          onUpdateButtonClick={handleUpdateDialogOpen}
        />
      ) : (
        <Typography>No Storage Areas found!</Typography>
      )}
      <StorageAreaCreationDialog
        onSubmit={onStorageAreaCreation}
        isOpen={creationDialogIsOpen}
        handleClose={handleCreationDialogClose}
      />
      {updateDialogIsOpen && codeOfCurrentlyUpdatingStorageArea && (
        <StorageAreaUpdateDialog
          key={codeOfCurrentlyUpdatingStorageArea}
          isOpen={updateDialogIsOpen}
          handleClose={handleUpdateDialogClose}
          storageAreaCode={codeOfCurrentlyUpdatingStorageArea}
        />
      )}
      {searchDialogIsOpen && (
        <StorageAreaSearchDialog
          isOpen={searchDialogIsOpen}
          handleClose={handleSearchDialogClose}
          onSubmit={onStorageAreaSearch}
        />
      )}
    </Box>
  );
};

export default StorageAreas;
