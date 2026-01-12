import { FilterAlt } from "@mui/icons-material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Box, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import DockRecordCreationDialog from "./DockRecordCreationDialog/DockRecordCreationDialog";
import DockRecordSearchDialog from "./DockRecordSearchDialog/DockRecordSearchDialog";
import DockRecordTable from "./DockRecordTable/DockRecordTable";
import DockRecordUpdateDialog from "./DockRecordUpdateDialog/DockRecordUpdateDialog";
import type { DockRecordSearchQuery } from "../../../../application/dock-record/queries/DockRecordSearchQuery";
import type { DockRecord } from "../../../../domain/Types/entities/DockRecord";
import { useCreateDockRecordMutation } from "../../../state-management/mutations/dock-record-mutations/useCreateDockRecordMutation";
import { useSearchDockRecordsQuery } from "../../../state-management/queries/dock-record-queries/useSearchDockRecordsQuery";
import type { DockRecordCommand } from "../../../../application/dock-record/commands/DockRecordCommand";

export interface Props {
  dockRecordsFromDatabase: DockRecord[];
}

const DockRecords = ({ dockRecordsFromDatabase }: Props) => {
  const [creationDialogIsOpen, setCreationDialogIsOpen] = useState(false);
  const [updateDialogIsOpen, setUpdateDialogIsOpen] = useState(false);
  const [searchDialogIsOpen, setSearchDialogIsOpen] = useState(false);
  const [
    codeOfCurrentlyUpdatingDockRecord,
    setCodeOfCurrentlyUpdatingDockRecord,
  ] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<DockRecordSearchQuery | null>(
    null
  );

  const createDockRecordMutation = useCreateDockRecordMutation();
  const searchDockRecordsQuery = useSearchDockRecordsQuery(searchQuery);

  const listCountZero = 0;

  const filteredDockRecords = searchDockRecordsQuery?.data;

  const filteredDockRecordListIsEmpty =
    filteredDockRecords?.length === listCountZero ||
    filteredDockRecords === undefined;

  const dockRecords = filteredDockRecordListIsEmpty
    ? dockRecordsFromDatabase
    : filteredDockRecords;

  const onDockRecordCreation = (command: DockRecordCommand) => {
    createDockRecordMutation.mutate(command);
    handleCreationDialogClose();
  };

  const onDockRecordSearch = (query: DockRecordSearchQuery) => {
    setSearchQuery(query);
    handleSearchDialogClose();
  };

  const handleCreationDialogOpen = () => {
    setCreationDialogIsOpen(true);
  };

  const handleCreationDialogClose = () => {
    setCreationDialogIsOpen(false);
  };

  const handleUpdateDialogOpen = (dockRecordCode: string) => {
    setCodeOfCurrentlyUpdatingDockRecord(dockRecordCode);
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
          Dock Records
        </Typography>
        <Box sx={{ width: "75%", textAlign: "right" }}>
          <IconButton
            data-testid="dock-record-filter-dialog-button"
            onClick={handleSearchDialogOpen}
          >
            <FilterAlt />
          </IconButton>
          <IconButton
            onClick={handleCreationDialogOpen}
            data-testid="dock-record-creation-dialog-button"
          >
            <AddCircleOutlineIcon />
          </IconButton>
        </Box>
      </Box>
      {dockRecords ? (
        <DockRecordTable
          dockRecords={dockRecords}
          onUpdateButtonClick={handleUpdateDialogOpen}
        />
      ) : (
        <Typography>No dock records found!</Typography>
      )}
      <DockRecordCreationDialog
        onSubmit={onDockRecordCreation}
        isOpen={creationDialogIsOpen}
        handleClose={handleCreationDialogClose}
      />
      {updateDialogIsOpen && codeOfCurrentlyUpdatingDockRecord && (
        <DockRecordUpdateDialog
          key={codeOfCurrentlyUpdatingDockRecord}
          isOpen={updateDialogIsOpen}
          handleClose={handleUpdateDialogClose}
          dockRecordCode={codeOfCurrentlyUpdatingDockRecord}
        />
      )}
      {searchDialogIsOpen && (
        <DockRecordSearchDialog
          isOpen={searchDialogIsOpen}
          handleClose={handleSearchDialogClose}
          onSubmit={onDockRecordSearch}
        />
      )}
    </Box>
  );
};

export default DockRecords;
