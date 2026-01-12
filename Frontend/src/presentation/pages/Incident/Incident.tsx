import { useState } from "react";
import { SearchIncidentQuery } from "../../../application/incident/queries/SearchIncidentQuery";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useSearchIncidents } from "../../state-management/queries/incident-queries/useSearchIncidents";
import { useCreateIncidentMutation } from "../../state-management/mutations/incident-mutations/useCreateIncidentMutation";
import { CreateIncidentCommand } from "../../../application/incident/command/CreateIncidentComman";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { Box, IconButton, Typography } from "@mui/material";
import { FilterAlt } from "@mui/icons-material";
import IncidentTable from "./IncidentTable/IncidentTable";
import IncidentCreationDialog from "./IncidentCreationDialog/IncidentCreationDialog";
import IncidentSearchDialog from "./IncidentSearchDialog/IncidentSearchDialog";
import { useResolveIncidentMutation } from "../../state-management/mutations/incident-mutations/useResolveIncidentMutation";
import { useAssociateVVEtoIncidentMutation } from "../../state-management/mutations/incident-mutations/useAssociateVVEtoIncidentMutation";
import { useDetachVVEfromIncidentMutation } from "../../state-management/mutations/incident-mutations/useDetachVVEfromIncidentMutation";
import { VVEtoIncidentCommand } from "../../../application/incident/command/VVEtoIncidentCommand";
import AssociateVVEDialog from "./AssociateVVEDialog/AssociateVVEDialog";
import DetachVVEDialog from "./DetachVVEDialog/DetachVVEDialog";
import { VVE } from "../../../domain/Types/entities/VVE";

const Incident = () => {
  const [creationDialogIsOpen, setCreationDialogIsOpen] = useState(false);
  const [associateVVEDialogIsOpen, setAssociateDialogIsOpen] = useState(false);
  const [associateVVEIncidentCode, setAssociateVVEIncidentCode] = useState<string | null>(null);
  const [detachVVEDialogIsOpen, setDetachVVEDialogIsOpen] = useState(false);
  const [detachVVEIncidentCode, setDetachVVEIncidentCode] = useState<string | null>(null);
  const [detachVVEs, setDetachVVEs] = useState<VVE[]>([]);
  const [searchDialogIsOpen, setSearchDialogIsOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState<SearchIncidentQuery>({});

  const searchIncidentsQuery = useSearchIncidents(searchQuery);

  const createIncidentMutation = useCreateIncidentMutation();
  const associateVVEMutation = useAssociateVVEtoIncidentMutation();
  const detachVVEMutation = useDetachVVEfromIncidentMutation();

  const handleCreationDialogOpen = () => setCreationDialogIsOpen(true);
  const handleCreationDialogClose = () => setCreationDialogIsOpen(false);

  const handleSearchDialogOpen = () => setSearchDialogIsOpen(true);
  const handleSearchDialogClose = () => setSearchDialogIsOpen(false);

  const handleAssociateDialogOpen = (code: string) => {
    setAssociateDialogIsOpen(true);
    setAssociateVVEIncidentCode(code);
  };
  const handleAssociateDialogClose = () => {
    setAssociateDialogIsOpen(false);
    setAssociateVVEIncidentCode(null);
  };

  const handleDetachDialogOpen = (code: string, vves: VVE[]) => {
    setDetachVVEDialogIsOpen(true);
    setDetachVVEIncidentCode(code);
    setDetachVVEs(vves);
  };
  const handleDetachDialogClose = () => {
    setDetachVVEDialogIsOpen(false);
    setDetachVVEIncidentCode(null);
    setDetachVVEs([]);
  };

  const onIncidentCreation = async (command: CreateIncidentCommand) => {
    try {
      await createIncidentMutation.mutateAsync(command);
      handleCreationDialogClose();
    } catch {}
  };
  const onAssociate = async (command: VVEtoIncidentCommand) => {
    try {
      await associateVVEMutation.mutateAsync(command);
      handleAssociateDialogClose();
    } catch {}
  };
  const onDetach = async (command: VVEtoIncidentCommand) => {
    try {
      await detachVVEMutation.mutateAsync(command);
      handleDetachDialogClose();
    } catch {}
  };

  const resolveIncidentMutation = useResolveIncidentMutation();
  const handleResolve = (code: string) => {
    resolveIncidentMutation.mutate(code);
  };

  if (searchIncidentsQuery.isLoading) return <LoadingScreen />;

  if (searchIncidentsQuery.isError) {
    return <Typography>Incident search error!</Typography>;
  }

  const incidents = searchIncidentsQuery.data;

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ textAlign: "right" }}>
          <IconButton data-testid="incident-filter-dialog-button" onClick={handleSearchDialogOpen}>
            <FilterAlt />
          </IconButton>

          <IconButton
            data-testid="incident-creation-dialog-button"
            onClick={handleCreationDialogOpen}
            disabled={createIncidentMutation.isPending}
          >
            <AddCircleOutlineIcon />
          </IconButton>
        </Box>
      </Box>

      {incidents && incidents.length > 0 ? (
        <IncidentTable
          incidents={incidents}
          onResolveButtonClick={handleResolve}
          onAssociateVVEButtonClick={handleAssociateDialogOpen}
          onDetachVVEButtonClick={handleDetachDialogOpen}
        />
      ) : (
        <Typography>No incidents found!</Typography>
      )}

      <IncidentCreationDialog
        onSubmit={onIncidentCreation}
        isOpen={creationDialogIsOpen}
        handleClose={handleCreationDialogClose}
      />

      {searchDialogIsOpen && (
        <IncidentSearchDialog
          isOpen={searchDialogIsOpen}
          handleClose={handleSearchDialogClose}
          initialQuery={searchQuery}
          onApply={(q) => setSearchQuery(q)}
          onClear={() => setSearchQuery({})}
        />
      )}
      {associateVVEDialogIsOpen && associateVVEIncidentCode && (
        <AssociateVVEDialog
          isOpen={associateVVEDialogIsOpen}
          handleClose={handleAssociateDialogClose}
          onSubmit={onAssociate}
          incidentCode={associateVVEIncidentCode}
        />
      )}
      {detachVVEDialogIsOpen && detachVVEIncidentCode && (
        <DetachVVEDialog
          isOpen={detachVVEDialogIsOpen}
          handleClose={handleDetachDialogClose}
          onSubmit={onDetach}
          incidentCode={detachVVEIncidentCode}
          vves={detachVVEs}
        />
      )}
    </Box>
  );
};

export default Incident;
