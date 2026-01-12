import { useState } from "react";
import type { Qualification } from "../../../../../domain/Types/entities/Qualification";
import type { QualificationSearchQuery } from "../../../../../application/qualification/queries/QualificationSearchQuery";
import { useCreateQualificationMutation } from "../../../../state-management/mutations/qualification-mutations/useCreateQualificationMutation";
import { useSearchQualificationsQuery } from "../../../../state-management/queries/qualification-queries/useSearchQualificationsQuery";
import type { QualificationCreateDto } from "../../../../../infrastructure/dtos/qualification/qualificationCreateDto";
import { Box, IconButton, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import QualificationsCreationDialogue from "./QualificationsCreationDialog/QualificationsCreationDialog";
import QualificationsTable from "./QualificationTable/QualificationTable";
import QualificationUpdateDialog from "./QualificationUpdateDialog/QualificationUpdateDialog";
import QualificationSearchDialog from "./QualificationSearchDialog/QualificationSearchDialog";

interface Props {
  qualificationsFromDatabase: Qualification[];
}

const Qualifications = ({ qualificationsFromDatabase }: Props) => {
  const [qualificationDialogIsOpen, setQualificationDialogIsOpen] =
    useState(false);
  const [updateDialogIsOpen, setUpdateDialogIsOpen] = useState(false);
  const [searchDialogIsOpen, setSearchDialogIsOpen] = useState(false);
  const [
    codeOfCurrentlyUpdatingQualification,
    setCodeOfCurrentlyUpdatingQualification,
  ] = useState("");
  const [searchQuery, setSearchQuery] =
    useState<QualificationSearchQuery | null>(null);

  const createQualificationMutation = useCreateQualificationMutation();
  const searchQualificationsQuery = useSearchQualificationsQuery(searchQuery);

  const listCountZero = 0;

  const filteredQualifications = searchQualificationsQuery?.data;

  const filteredQualificationListIsEmpty =
    filteredQualifications?.length === listCountZero ||
    filteredQualifications === undefined;

  const qualifications = filteredQualificationListIsEmpty
    ? qualificationsFromDatabase
    : filteredQualifications;

  const onQualificationCreation = async (
    qualification: QualificationCreateDto
  ) => {
    createQualificationMutation.mutate(qualification);
    handleCreationDialogClose();
  };

  const onQualificationSearch = (query: QualificationSearchQuery) => {
    setSearchQuery(query);
    handleSearchDialogClose();
  };

  const handleCreationDialogOpen = () => {
    setQualificationDialogIsOpen(true);
  };

  const handleCreationDialogClose = () => {
    setQualificationDialogIsOpen(false);
  };

  const handleUpdateDialogOpen = (qualificationCode: string) => {
    setCodeOfCurrentlyUpdatingQualification(qualificationCode);
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
          Qualifications
        </Typography>
        <Box sx={{ width: "75%", textAlign: "right" }}>
          <IconButton
            data-testid="qualification-filter-dialog-button"
            onClick={handleSearchDialogOpen}
          >
            <FilterAltIcon />
          </IconButton>
          <IconButton
            onClick={handleCreationDialogOpen}
            data-testid="qualification-creation-dialog-button"
          >
            <AddCircleOutlineIcon />
          </IconButton>
        </Box>
      </Box>
      {qualifications ? (
        <QualificationsTable
          qualifications={qualifications}
          onUpdateButtonClick={handleUpdateDialogOpen}
        />
      ) : (
        <Typography>No qualifications found!</Typography>
      )}
      <QualificationsCreationDialogue
        onSubmit={onQualificationCreation}
        isOpen={qualificationDialogIsOpen}
        handleClose={handleCreationDialogClose}
      />
      {updateDialogIsOpen && (
        <QualificationUpdateDialog
          isOpen={updateDialogIsOpen}
          handleClose={handleUpdateDialogClose}
          qualificationCode={codeOfCurrentlyUpdatingQualification}
        />
      )}
      {searchDialogIsOpen && (
        <QualificationSearchDialog
          isOpen={searchDialogIsOpen}
          handleClose={handleSearchDialogClose}
          onSubmit={onQualificationSearch}
        />
      )}
    </Box>
  );
};

export default Qualifications;
