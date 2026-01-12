import { Add } from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useState } from "react";

import { useUserContext } from "../../../context/userContext";
import SARVVNTable from "./SARVVNs/SARVVNsTable/SARVVNsTable";
import SARVVNUpdateDialog from "./SARVVNs/SARVVNUpdate/SARVVNUpdateDialog/SARVVNUpdateDialog";
import FullVVNDialog from "./SARVVNs/VVNCreateForms/FullVVN/FullVVNDialog/FullVVNDialog";
import LoadVVNDialog from "./SARVVNs/VVNCreateForms/LoadVVN/LoadVVNDialog/LoadVVNDialog";
import MaintenenceVVNDialog from "./SARVVNs/VVNCreateForms/MaintenenceVVN/MaintenenceVVNDialog/MaintenenceVVNDialog";
import UnloadVVNDialog from "./SARVVNs/VVNCreateForms/UnloadVVN/UnloadVVNDialog/UnloadVVNDialog";
import { useGetAllSarVvnsQuery } from "../../../state-management/queries/sar-queries/useGetAllSarVvnsQuery";
import type { VVN } from "../../../../domain/Types/entities/VVN";

export default function SARView() {
  const user = useUserContext();

  const getAllSarVvnQuery = useGetAllSarVvnsQuery(user.email);
  const { data: vvns, isLoading, isError } = getAllSarVvnQuery;

  const [isCreateMainteneceVVNDialogOpen, setIsCreateMainteneceVVNDialogOpen] =
    useState(false);
  const handleOpenCreateMainteneceVVNDialog = () => {
    setIsCreateMainteneceVVNDialogOpen(true);
  };
  const handleCloseCreateMainteneceVVNDialog = () => {
    setIsCreateMainteneceVVNDialogOpen(false);
  };

  const [isCreateUnloadVVNDialogOpen, setIsCreateUnloadVVNDialogOpen] =
    useState(false);
  const handleOpenCreateUnloadVVNDialog = () => {
    setIsCreateUnloadVVNDialogOpen(true);
  };
  const handleCloseCreateUnloadVVNDialog = () => {
    setIsCreateUnloadVVNDialogOpen(false);
  };

  const [isCreateLoadVVNDialogOpen, setIsCreateLoadVVNDialogOpen] =
    useState(false);
  const handleOpenCreateLoadVVNDialog = () => {
    setIsCreateLoadVVNDialogOpen(true);
  };
  const handleCloseCreateLoadVVNDialog = () => {
    setIsCreateLoadVVNDialogOpen(false);
  };

  const [isCreateFullVVNDialogOpen, setIsCreateFullVVNDialogOpen] =
    useState(false);
  const handleOpenCreateFullVVNDialog = () => {
    setIsCreateFullVVNDialogOpen(true);
  };
  const handleCloseCreateFullVVNDialog = () => {
    setIsCreateFullVVNDialogOpen(false);
  };

  const [updateVVNDialogIsOpen, setUpdateVVNDialogIsOpen] = useState(false);
  const [vvnToUpdate, setVvnToUpdate] = useState<VVN | null>(null);
  const handleOpenUpdateVVNDialog = (vvn: VVN) => {
    setVvnToUpdate(vvn);
    setUpdateVVNDialogIsOpen(true);
  };
  const handleCloseUpdateVVNDialog = () => {
    setUpdateVVNDialogIsOpen(false);
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return (
      <Typography fontWeight={"bold"} sx={{ width: "25%" }}>
        Fatal Error!
      </Typography>
    );
  }

  return (
    <Box>
      <ButtonGroup variant="contained">
        <Button
          onClick={handleOpenCreateMainteneceVVNDialog}
          startIcon={<Add />}
        >
          Maintenance VVN
        </Button>
        <Button onClick={handleOpenCreateLoadVVNDialog} startIcon={<Add />}>
          Load VVN
        </Button>
        <Button onClick={handleOpenCreateUnloadVVNDialog} startIcon={<Add />}>
          Unload VVN
        </Button>
        <Button onClick={handleOpenCreateFullVVNDialog} startIcon={<Add />}>
          Full VVN
        </Button>
      </ButtonGroup>
      {vvns ? (
        <SARVVNTable
          vvns={vvns}
          onUpdateButtonClick={handleOpenUpdateVVNDialog}
        />
      ) : (
        <Typography>No notifications!</Typography>
      )}
      {updateVVNDialogIsOpen && vvnToUpdate && (
        <SARVVNUpdateDialog
          isOpen={updateVVNDialogIsOpen}
          handleClose={handleCloseUpdateVVNDialog}
          vvn={vvnToUpdate}
        />
      )}
      {isCreateMainteneceVVNDialogOpen && (
        <MaintenenceVVNDialog
          isOpen={isCreateMainteneceVVNDialogOpen}
          handleClose={handleCloseCreateMainteneceVVNDialog}
        />
      )}
      {isCreateUnloadVVNDialogOpen && (
        <UnloadVVNDialog
          isOpen={isCreateUnloadVVNDialogOpen}
          handleClose={handleCloseCreateUnloadVVNDialog}
        />
      )}
      {isCreateLoadVVNDialogOpen && (
        <LoadVVNDialog
          isOpen={isCreateLoadVVNDialogOpen}
          handleClose={handleCloseCreateLoadVVNDialog}
        />
      )}
      {isCreateFullVVNDialogOpen && (
        <FullVVNDialog
          isOpen={isCreateFullVVNDialogOpen}
          handleClose={handleCloseCreateFullVVNDialog}
        />
      )}
    </Box>
  );
}
