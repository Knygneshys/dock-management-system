import { useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { SearchIncidentTypesQuery } from "../../../application/incident-type/queries/SearchIncidentTypesQuery";
import { useSearchIncidentTypesQuery } from "../../state-management/queries/incident-type/useSearchIncidentTypesQuery";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { Box, Button, IconButton, Typography } from "@mui/material";
import IncidentTypesTable from "./IncidentTypesTable/IncidentTypesTable";
import { FilterAlt } from "@mui/icons-material";
import { IncidentType } from "../../../domain/Types/entities/IncidentType";
import IncidentTypeCreationDialog from "./IncidentTypeCreationDialog/IncidentTypeCreationDialog";
import { useCreateIncidentTypeMutation } from "../../state-management/mutations/incident-type-mutations/useCreateIncidentTypeMutation";
import IncidentTypeUpdateDialog from "./IncidentTypeUpdateDialog/IncidentTypeUpdateDialog";
import IncidentTypeSearchDialog from "./IncidentTypeSearchDialog/IncidentTypeSearchDialog";
import { accentColor } from "../../constants/colorscheme";

export default function IncidentTypes() {
  const [isCreationDialogOpen, setIsCreationDialogOpen] =
    useState<boolean>(false);
  const [updateDialogIsOpen, setUpdateDialogIsOpen] = useState<boolean>(false);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<SearchIncidentTypesQuery>({});
  const [
    codeOfCurrentlyUpdatingIncidentType,
    setCodeOfCurrentlyUpdatingIncidentType,
  ] = useState<string>("");

  const searchIncidentTypesQuery = useSearchIncidentTypesQuery(searchQuery);

  const incidentTypes = searchIncidentTypesQuery.data;

  const createIncidentTypeMutation = useCreateIncidentTypeMutation();

  const onIncidentTypeSubmit = (incidentType: IncidentType) => {
    createIncidentTypeMutation.mutate(incidentType);
    handleCreationDialogClose();
  };

  const onUpdateButtonClick = (code: string) => {
    setCodeOfCurrentlyUpdatingIncidentType(code);
    setUpdateDialogIsOpen(true);
  };

  const handleCreationDialogOpen = () => {
    setIsCreationDialogOpen(true);
  };

  const handleCreationDialogClose = () => {
    setIsCreationDialogOpen(false);
  };

  const handleUpdateDialogClose = () => {
    setUpdateDialogIsOpen(false);
  };

  const handleSearchDialogOpen = () => {
    setIsSearchDialogOpen(true);
  };

  const handleSearchDialogClose = () => {
    setIsSearchDialogOpen(false);
  };

  const onIncidentTypeSearch = (query: SearchIncidentTypesQuery) => {
    setSearchQuery(query);
    handleSearchDialogClose();
  };

  if (searchIncidentTypesQuery.isLoading) {
    return <LoadingScreen />;
  }

  if (searchIncidentTypesQuery.isError || incidentTypes === undefined) {
    return <Typography>Failed to fetch incident types!</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography fontWeight={"bold"} sx={{ width: "25%" }}>
          Incident Types
        </Typography>
        <Box sx={{ width: "75%", textAlign: "right" }}>
          {Object.keys(searchQuery).length !== 0 && (
            <Button
              sx={{ backgroundColor: accentColor }}
              onClick={() => setSearchQuery({})}
            >
              Clear Filter
            </Button>
          )}
          <IconButton onClick={handleSearchDialogOpen}>
            <FilterAlt />
          </IconButton>
          <IconButton onClick={handleCreationDialogOpen}>
            <AddCircleOutlineIcon />
          </IconButton>
        </Box>
      </Box>
      <IncidentTypesTable
        incidentTypes={incidentTypes}
        onUpdateButtonClick={onUpdateButtonClick}
      />
      <IncidentTypeCreationDialog
        onSubmit={onIncidentTypeSubmit}
        isOpen={isCreationDialogOpen}
        handleClose={handleCreationDialogClose}
      />
      {updateDialogIsOpen && (
        <IncidentTypeUpdateDialog
          isOpen={updateDialogIsOpen}
          handleClose={handleUpdateDialogClose}
          incidentTypeCode={codeOfCurrentlyUpdatingIncidentType}
        />
      )}
      {isSearchDialogOpen && (
        <IncidentTypeSearchDialog
          isOpen={isSearchDialogOpen}
          handleClose={handleSearchDialogClose}
          onSubmit={onIncidentTypeSearch}
        />
      )}
    </Box>
  );
}
