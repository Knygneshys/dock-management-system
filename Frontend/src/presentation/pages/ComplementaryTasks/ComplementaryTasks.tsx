import { useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { CompTaskSearchQuery } from "../../../application/complementary-task/queries/CompTaskSearchQuery";
import { useCreateCompTaskMutation } from "../../state-management/mutations/comp-tasks-mutations/useCreateCompTaskMutation";
import { useSearchCompTasksQuery } from "../../state-management/queries/comp-tasks-queries/useSearchCompTasksQuery";
import { useGetAllCompTasksQuery } from "../../state-management/queries/comp-tasks-queries/useGetAllCompTasksQuery";
import { CreateCompTaskDto } from "../../../infrastructure/dtos/complementary-tasks/CreateCompTaskDto";
import CompTaskTable from "./CompTaskTable/CompTaskTable";
import CompTaskCreationDialog from "./CompTaskCreationDialog/CompTaskCreationDialog";
import CompTaskUpdateDialog from "./CompTaskUpdateDialog/CompTaskUpdateDialog";
import CompTaskSearchDialog from "./CompTaskSearchDialog/CompTaskSearchDialog";


const ComplementaryTasks = () => {
  const [creationDialogIsOpen, setCreationDialogIsOpen] = useState(false);
  const [updateDialogIsOpen, setUpdateDialogIsOpen] = useState(false);
  const [searchDialogIsOpen, setSearchDialogIsOpen] = useState(false);
  const [codeOfCurrentlyUpdatingTask, setCodeOfCurrentlyUpdatingTask] = useState("");
  const [searchQuery, setSearchQuery] = useState<CompTaskSearchQuery | null>(null);

  const createCompTaskMutation = useCreateCompTaskMutation();
  const searchCompTasksQuery = useSearchCompTasksQuery(searchQuery);
  const getAllCompTasksQuery = useGetAllCompTasksQuery();

  const listCountZero = 0;

  const compTasksFromDatabase = getAllCompTasksQuery.data || [];
  const filteredCompTasks = searchCompTasksQuery?.data;

  const filteredCompTaskListIsEmpty =
    filteredCompTasks?.length === listCountZero || filteredCompTasks === undefined;

  const compTasks = filteredCompTaskListIsEmpty
    ? compTasksFromDatabase
    : filteredCompTasks;

  const onCompTaskCreation = async (compTask: CreateCompTaskDto) => {
    createCompTaskMutation.mutate(compTask);
    handleCreationDialogClose();
  };

  const onCompTaskSearch = (query: CompTaskSearchQuery) => {
    setSearchQuery(query);
    handleSearchDialogClose();
  };

  const handleCreationDialogOpen = () => {
    setCreationDialogIsOpen(true);
  };

  const handleCreationDialogClose = () => {
    setCreationDialogIsOpen(false);
  };

  const handleUpdateDialogOpen = (taskCode: string) => {
    setCodeOfCurrentlyUpdatingTask(taskCode);
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

  if (getAllCompTasksQuery.isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography fontWeight={"bold"} sx={{ width: "25%" }}>
          Complementary Tasks
        </Typography>
        <Box sx={{ width: "75%", textAlign: "right" }}>
          <IconButton
            data-testid="comp-task-filter-dialog-button"
            onClick={handleSearchDialogOpen}
          >
            <FilterAltIcon />
          </IconButton>
          <IconButton
            onClick={handleCreationDialogOpen}
            data-testid="comp-task-creation-dialog-button"
          >
            <AddCircleOutlineIcon />
          </IconButton>
        </Box>
      </Box>
      {compTasks && compTasks.length > 0 ? (
        <CompTaskTable
          compTasks={compTasks}
          onUpdateButtonClick={handleUpdateDialogOpen}
        />
      ) : (
        <Typography>No complementary tasks found!</Typography>
      )}
      <CompTaskCreationDialog
        onSubmit={onCompTaskCreation}
        isOpen={creationDialogIsOpen}
        handleClose={handleCreationDialogClose}
      />
      {updateDialogIsOpen && (
        <CompTaskUpdateDialog
          isOpen={updateDialogIsOpen}
          handleClose={handleUpdateDialogClose}
          taskCode={codeOfCurrentlyUpdatingTask}
        />
      )}
      {searchDialogIsOpen && (
        <CompTaskSearchDialog
          isOpen={searchDialogIsOpen}
          handleClose={handleSearchDialogClose}
          onSubmit={onCompTaskSearch}
        />
      )}
    </Box>
  );
};

export default ComplementaryTasks;