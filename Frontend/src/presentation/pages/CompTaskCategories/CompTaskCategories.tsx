import { FilterAlt } from "@mui/icons-material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Box, IconButton, Typography } from "@mui/material";
import { useState } from "react";

import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { useSearchCompTaskCategoriesQuery } from "../../state-management/queries/comp-task-category-queries/useSearchCompTaskCategoriesQuery";
import { CompTaskCategorySearchQuery } from "../../../application/complementary-task-category/queries/CompTaskCategorySearchQuery";
import { useCreateCompTaskCategoryMutation } from "../../state-management/mutations/comp-tasks-category-mutations/useCreateCompTaskCategoryMutation ";
import { CreateCompTaskCategoryDTO } from "../../../infrastructure/dtos/comp-task-category/CreateCompTaskCategoryDTO";
import CompTaskCategoryTable from "./CTCTable/CompTaskCategoryTable";
import CompTaskCategoryCreationDialog from "./CTCCreationDialog/CompTaskCategoryCreationDialog";
import CompTaskCategorySearchDialog from "./CTCSearchDialog/CompTaskCategorySearchDialog";

const CompTaskCategories = () => {
  const [creationDialogIsOpen, setCreationDialogIsOpen] = useState(false);
  const [searchDialogIsOpen, setSearchDialogIsOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState<CompTaskCategorySearchQuery>({});

  const searchCategoriesQuery = useSearchCompTaskCategoriesQuery(searchQuery);

  const createCategoryMutation = useCreateCompTaskCategoryMutation();

  const handleCreationDialogOpen = () => setCreationDialogIsOpen(true);
  const handleCreationDialogClose = () => setCreationDialogIsOpen(false);

  const handleSearchDialogOpen = () => setSearchDialogIsOpen(true);
  const handleSearchDialogClose = () => setSearchDialogIsOpen(false);

  const onCategoryCreation = async (dto: CreateCompTaskCategoryDTO) => {
    try {
      await createCategoryMutation.mutateAsync(dto);
      handleCreationDialogClose();
    } catch {}
  };

  if (searchCategoriesQuery.isLoading) return <LoadingScreen />;

  if (searchCategoriesQuery.isError) {
    return <Typography>Complementary task categories search error!</Typography>;
  }

  const categories = searchCategoriesQuery.data;

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ textAlign: "right" }}>
          <IconButton data-testid="ctc-filter-dialog-button" onClick={handleSearchDialogOpen}>
            <FilterAlt />
          </IconButton>

          <IconButton
            data-testid="ctc-creation-dialog-button"
            onClick={handleCreationDialogOpen}
            disabled={createCategoryMutation.isPending}
          >
            <AddCircleOutlineIcon />
          </IconButton>
        </Box>
      </Box>

      {categories && categories.length > 0 ? (
        <CompTaskCategoryTable categories={categories} />
      ) : (
        <Typography>No complementary task categories found!</Typography>
      )}

      <CompTaskCategoryCreationDialog
        onSubmit={onCategoryCreation}
        isOpen={creationDialogIsOpen}
        handleClose={handleCreationDialogClose}
      />

      {searchDialogIsOpen && (
        <CompTaskCategorySearchDialog
          isOpen={searchDialogIsOpen}
          handleClose={handleSearchDialogClose}
          initialQuery={searchQuery}
          onApply={(q) => setSearchQuery(q)}
          onClear={() => setSearchQuery({})}
        />
      )}
    </Box>
  );
};

export default CompTaskCategories;
