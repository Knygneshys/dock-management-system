import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";

import ConfirmationDialog from "../../../../../../shared/ConfirmationDialog/ConfirmationDialog";
import OperationalWindowUpdateDialog from "../OWUpdateDialog/OWUpdateDialog";
import OperationalWindowCreationDialog from "../OWCreationDialog/OWCreationDialog";
import type { StaffMember } from "../../../../../../../domain/Types/entities/StaffMember";
import type { OperationalWindow } from "../../../../../../../domain/Types/entities/OperationalWindow";
import { useCreateOperationalWindowMutation } from "../../../../../../state-management/mutations/staff-member-mutations/useCreateOperationalWindowMutation";
import { useDeleteOperationalWindowMutation } from "../../../../../../state-management/mutations/staff-member-mutations/useDeleteOperationalWindowMutation";
import { useUpdateOperationalWindowMutation } from "../../../../../../state-management/mutations/staff-member-mutations/useUpdateOperationalWindowMutation";
import type { OWCommand } from "../../../../../../../application/operational-window/commands/OWCommand";
import { accentColor } from "../../../../../../constants/colorscheme";

const MINIMUM_ARRAY_LENGTH = 0;
const SUBSTRING_START_INDEX = 0;
const TIME_FORMAT_LENGTH = 5;

interface OperationalWindowsDialogProps {
  isOpen: boolean;
  handleClose: () => void;
  staffMember: StaffMember | null;
}

export default function OperationalWindowsDialog({
  isOpen,
  handleClose,
  staffMember,
}: OperationalWindowsDialogProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedWindow, setSelectedWindow] =
    useState<OperationalWindow | null>(null);

  const createOperationalWindowMutation = useCreateOperationalWindowMutation();
  const deleteOperationalWindowMutation = useDeleteOperationalWindowMutation();
  const updateOperationalWindowMutation = useUpdateOperationalWindowMutation();

  const formatTime = (timeString?: string | null): string => {
    if (!timeString) {
      return "--:--";
    }
    return timeString.substring(SUBSTRING_START_INDEX, TIME_FORMAT_LENGTH);
  };

  const handleCreateClick = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateSubmit = async (command: OWCommand) => {
    if (!staffMember) return;

    try {
      await createOperationalWindowMutation.mutateAsync({
        mecanographicNumber: staffMember.mecanographicNumber,
        command,
      });
      setCreateDialogOpen(false);
      handleClose();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCreateClose = () => {
    setCreateDialogOpen(false);
  };

  const handleDeleteClick = (window: OperationalWindow) => {
    setSelectedWindow(window);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!staffMember || !selectedWindow) return;

    try {
      await deleteOperationalWindowMutation.mutateAsync({
        mecanographicNumber: staffMember.mecanographicNumber,
        operationalWindowCode: selectedWindow.code,
      });
      setDeleteDialogOpen(false);
      setSelectedWindow(null);
      handleClose();
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setSelectedWindow(null);
  };

  const handleEditClick = (window: OperationalWindow) => {
    setSelectedWindow(window);
    setEditDialogOpen(true);
  };

  const handleUpdateSubmit = async (command: OWCommand) => {
    if (!staffMember || !selectedWindow) return;

    try {
      await updateOperationalWindowMutation.mutateAsync({
        mecanographicNumber: staffMember.mecanographicNumber,
        operationalWindowCode: selectedWindow.code,
        command,
      });
      setEditDialogOpen(false);
      setSelectedWindow(null);
      handleClose();
    } catch (error) {
      console.error("Error updating:", error);
    }
  };

  const handleUpdateClose = () => {
    setEditDialogOpen(false);
    setSelectedWindow(null);
  };

  return (
    <>
      <Dialog open={isOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">
              Operational Windows - {staffMember?.name}
            </Typography>
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              onClick={handleCreateClick}
              size="small"
              sx={{ background: accentColor }}
            >
              Add Window
            </Button>
          </Box>
        </DialogTitle>

        <DialogContent>
          {staffMember?.operationalWindows &&
          staffMember.operationalWindows.length > MINIMUM_ARRAY_LENGTH ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Day of Week</TableCell>
                    <TableCell>Start Time</TableCell>
                    <TableCell>End Time</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {staffMember.operationalWindows
                    .slice()
                    .sort((a, b) => {
                      const daysOrder: Record<string, number> = {
                        Monday: 1,
                        Tuesday: 2,
                        Wednesday: 3,
                        Thursday: 4,
                        Friday: 5,
                        Saturday: 6,
                        Sunday: 7,
                      };
                      return daysOrder[a.dayOfWeek] - daysOrder[b.dayOfWeek];
                    })
                    .map((window) => (
                      <TableRow key={window.code}>
                        <TableCell>{window.dayOfWeek}</TableCell>
                        <TableCell>{formatTime(window.startTime)}</TableCell>
                        <TableCell>{formatTime(window.endTime)}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => handleEditClick(window)}
                            title="Edit"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteClick(window)}
                            title="Delete"
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography color="text.secondary">
                No operational windows defined for this staff member.
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button sx={{ background: accentColor }} onClick={handleClose}>
            Close
          </Button>
        </DialogActions>

        <OperationalWindowCreationDialog
          isOpen={createDialogOpen}
          handleClose={handleCreateClose}
          onSubmit={handleCreateSubmit}
        />

        <ConfirmationDialog
          open={deleteDialogOpen}
          title="Delete Operational Window"
          message={`Are you sure you want to delete the operational window for ${selectedWindow?.dayOfWeek}?`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          confirmText="Delete"
          cancelText="Cancel"
        />

        <OperationalWindowUpdateDialog
          isOpen={editDialogOpen}
          handleClose={handleUpdateClose}
          onSubmit={handleUpdateSubmit}
          operationalWindow={selectedWindow}
        />
      </Dialog>
    </>
  );
}
