import { FilterAlt } from "@mui/icons-material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import debounce from "lodash.debounce";
import { useEffect, useMemo, useState } from "react";
import ResourceCreationDialog from "./ResourceCreationDialog/ResourceCreationDialog";
import ResourceSearchDialog from "./ResourceSearchDialog/ResourceSearchDialog";
import ResourcesTable from "./ResourceTable/ResourceTable";
import { resourceStatus } from "../../../domain/Enums/resourceStatus";
import { useReactivateResourceMutation } from "../../state-management/mutations/resource-mutations/useReactivateResourceMutation";
import { useDeactivateResourceMutation } from "../../state-management/mutations/resource-mutations/useDeactivateResourceMutation";
import { useGetAllResourcesQuery } from "../../state-management/queries/resource-queries/useGetAllResourcesQuery";

const Resources = () => {
  const [creationDialogIsOpen, setCreationDialogIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState({
    description: "",
    status: resourceStatus.ACTIVE,
    type: ""
  });
  const [searchDialogIsOpen, setSearchDialogIsOpen] = useState(false);
  const handleSearchDialogOpen = () => {
    setSearchDialogIsOpen(true);
  };
  const handleSearchDialogClose = () => {
    setSearchDialogIsOpen(false);
  };
  const handleCreationDialogOpen = () => {
    setCreationDialogIsOpen(true);
  };

  const handleCreationDialogClose = () => {
    setCreationDialogIsOpen(false);
  };

  const reactivateResourceMutation = useReactivateResourceMutation();
  const handleReactivate = (resourceCode: string) => {
    reactivateResourceMutation.mutate(resourceCode);
  };

  const deactivateResourceMutation = useDeactivateResourceMutation();
  const handleDeactivate = (resourceCode: string) => {
    deactivateResourceMutation.mutate(resourceCode);
  };
  const getAllResourcesQuery = useGetAllResourcesQuery(searchQuery);

  const resources = getAllResourcesQuery.data;

  const handleSearchChange = (event: { target: { id: string; value: any; name: string } }) => {
    if (event.target.id === "resourceSearchDescription") {
      setSearchQuery((prevState) => ({
        ...prevState,
        description: event.target.value
      }));
    }
    if (event.target.name === "resourceSearchStatus") {
      setSearchQuery((prevState) => ({
        ...prevState,
        status: event.target.value
      }));
    }
    if (event.target.name === "resourceSearchType") {
      setSearchQuery((prevState) => ({
        ...prevState,
        type: event.target.value
      }));
    }
  };

  const typeDelayms = 300;
  const debouncedResults = useMemo(() => {
    return debounce(handleSearchChange, typeDelayms);
  }, []);
  useEffect(() => {
    return () => {
      debouncedResults.cancel();
    };
  });

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography fontWeight={"bold"} sx={{ width: "25%" }}>
          Resources
        </Typography>
        <Box sx={{ width: "75%", textAlign: "right" }}>
          <IconButton onClick={handleSearchDialogOpen}>
            <FilterAlt />
          </IconButton>
          <IconButton onClick={handleCreationDialogOpen}>
            <AddCircleOutlineIcon />
          </IconButton>
        </Box>
      </Box>

      {getAllResourcesQuery.isLoading ? (
        <CircularProgress />
      ) : resources ? (
        <ResourcesTable
          resources={resources}
          onDeactivateButtonClick={handleDeactivate}
          onReactivateButtonClick={handleReactivate}
        />
      ) : (
        <Typography>No Resources found!</Typography>
      )}
      {creationDialogIsOpen && (
        <ResourceCreationDialog isOpen={creationDialogIsOpen} handleClose={handleCreationDialogClose} />
      )}
      <ResourceSearchDialog
        isOpen={searchDialogIsOpen}
        handleClose={handleSearchDialogClose}
        onChange={debouncedResults}
        searchQuery={searchQuery}
      />
    </Box>
  );
};

export default Resources;
