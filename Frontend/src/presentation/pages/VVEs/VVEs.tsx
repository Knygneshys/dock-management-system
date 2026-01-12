import { useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { VVESearchQuery } from "../../../application/vve/queries/VVESearchQuery";
import { useSearchVVEsQuery } from "../../state-management/queries/vve-queries/useSearchVVEsQuery";
import { useGetAllVVEsQuery } from "../../state-management/queries/vve-queries/useGetAllVVEsQuery";
import VVETable from "./VVETable/VVETable";
import VVESearchDialog from "./VVESearchDialog/VVESearchDialog";
import ExecutedOperationDialog from "./ExecutedOperationDialog/ExecutedOperationDialog";

const VVEs = () => {
  const [searchDialogIsOpen, setSearchDialogIsOpen] = useState(false);
  const [isExecutedOperationDialogOpen, setIsExecutedOperationDialogOpen] =
    useState<boolean>(false);
  const [selectedVve, setSelectedVve] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<VVESearchQuery | null>(null);

  const searchVVEsQuery = useSearchVVEsQuery(searchQuery);
  const getAllVVEsQuery = useGetAllVVEsQuery();

  const listCountZero = 0;

  const vvesFromDatabase = getAllVVEsQuery.data || [];
  const filteredVVEs = searchVVEsQuery?.data;

  const filteredVVEListIsEmpty =
    filteredVVEs?.length === listCountZero || filteredVVEs === undefined;

  const vves = searchQuery ? filteredVVEs || [] : vvesFromDatabase;
  const onVVESearch = (query: VVESearchQuery) => {
    setSearchQuery(query);
    handleSearchDialogClose();
  };

  const handleSearchDialogOpen = () => {
    setSearchDialogIsOpen(true);
  };

  const handleSearchDialogClose = () => {
    setSearchDialogIsOpen(false);
  };

  const handleExecutedOperationDialogOpen = (code: number) => {
    setSelectedVve(code);
    setIsExecutedOperationDialogOpen(true);
  };

  const handleExecutedOperationDialogClose = () => {
    setIsExecutedOperationDialogOpen(false);
  };

  if (getAllVVEsQuery.isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography fontWeight={"bold"} sx={{ width: "25%" }}>
          Vessel Visit Executions
        </Typography>
        <Box sx={{ width: "75%", textAlign: "right" }}>
          <IconButton
            data-testid="vve-filter-dialog-button"
            onClick={handleSearchDialogOpen}
          >
            <FilterAltIcon />
          </IconButton>
        </Box>
      </Box>
      {vves && vves.length > 0 ? (
        <VVETable
          vves={vves}
          handleExecutedOperationDialogOpen={handleExecutedOperationDialogOpen}
        />
      ) : (
        <Typography>No VVEs found!</Typography>
      )}
      {searchDialogIsOpen && (
        <VVESearchDialog
          isOpen={searchDialogIsOpen}
          handleClose={handleSearchDialogClose}
          onSubmit={onVVESearch}
        />
      )}
      {isExecutedOperationDialogOpen && selectedVve && (
        <ExecutedOperationDialog
          isOpen={isExecutedOperationDialogOpen}
          vveCode={selectedVve}
          handleClose={handleExecutedOperationDialogClose}
        />
      )}
    </Box>
  );
};

export default VVEs;
