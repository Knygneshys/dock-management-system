import { useState } from "react";
import { OperationPlanSearchQuery } from "../../../application/operation-plan/queries/OperationPlanSearchQuery";
import { useSearchOperationPlansQuery } from "../../state-management/queries/operation-plan-queries/useSearchOperationPlansQuery";
import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import { FilterAlt } from "@mui/icons-material";
import OperationPlanTable from "./OperationPlanTable/OperationPlanTable";
import OperationPlanSearchDialog from "./OperationPlanSearchDialog/OperationPlanSearchDialog";
import OperationPlanUpdateDialog from "./OperationPlanUpdateDialog/OperationPlanUpdateDialog";

const OperationPlan = () => {
  const [searchQuery, setSearchQuery] = useState<OperationPlanSearchQuery>({});
  const [updateDialogIsOpen, setUpdateDialogIsOpen] = useState(false);
  const [searchDialogIsOpen, setSearchDialogIsOpen] = useState<boolean>(false);
  const [
    vvnCodeOfCurrentlyUpdatingOperationPlan,
    setVvnCodeOfCurrentlyUpdatingOperationPlan,
  ] = useState<number | null>();
  const handleSearchDialogOpen = () => {
    setSearchDialogIsOpen(true);
  };
  const handleSearchDialogClose = () => {
    setSearchDialogIsOpen(false);
  };
  const searchOpPlansQuery = useSearchOperationPlansQuery(searchQuery);

  const opPlans = searchOpPlansQuery.data;

  const handleUpdateDialogClose = () => {
    setUpdateDialogIsOpen(false);
  };

  const onUpdateButtonClick = (vvnCode: number) => {
    setVvnCodeOfCurrentlyUpdatingOperationPlan(vvnCode);
    setUpdateDialogIsOpen(true);
  };

  const handleSearchChange = (event: {
    target: { id: string; value: any; name: string };
  }) => {
    if (event.target.id === "opPlanVVNCode") {
      setSearchQuery((prevState) => ({
        ...prevState,
        vvnCode: event.target.value,
      }));
    }
    if (event.target.name === "sortOpPlansBy") {
      setSearchQuery((prevState) => ({
        ...prevState,
        sortBy: event.target.value,
      }));
    }
    if (event.target.name === "sortOpPlansDir") {
      setSearchQuery((prevState) => ({
        ...prevState,
        sortDir: event.target.value,
      }));
    }
  };

  return (
    <Box>
      <Box sx={{ width: "75%", textAlign: "right" }}>
        <IconButton onClick={handleSearchDialogOpen}>
          <FilterAlt />
        </IconButton>
      </Box>

      {searchOpPlansQuery.isLoading ? (
        <CircularProgress />
      ) : opPlans ? (
        <OperationPlanTable
          opPlans={opPlans}
          onUpdateButtonClick={onUpdateButtonClick}
        />
      ) : (
        <Typography>No Operation Plans found!</Typography>
      )}

      <OperationPlanSearchDialog
        isOpen={searchDialogIsOpen}
        handleClose={handleSearchDialogClose}
        onChange={handleSearchChange}
        query={searchQuery}
      />
      {updateDialogIsOpen && vvnCodeOfCurrentlyUpdatingOperationPlan && (
        <OperationPlanUpdateDialog
          isOpen={updateDialogIsOpen}
          handleClose={handleUpdateDialogClose}
          operationPlanVvnCode={vvnCodeOfCurrentlyUpdatingOperationPlan}
        />
      )}
    </Box>
  );
};

export default OperationPlan;
