import React, { useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Box, IconButton, Typography } from "@mui/material";

import ConfirmationDialog from "../../../../shared/ConfirmationDialog/ConfirmationDialog";
import OperationalWindowsDialog from "./OW/OWDialog/OWDialog";
import StaffMemberCreationDialog from "./StaffMemberCreationDialog/StaffMemberCreationDialog";
import StaffMemberTable from "./StaffMemberTable/StaffMemberTable";
import StaffMemberUpdateDialog from "./StaffMemberUpdateDialog/StaffMemberUpdateDialog";
import StaffQualificationsDialog from "./StaffQualificationsDialog/StaffQualificationsDialog";
import type { StaffMember } from "../../../../../domain/Types/entities/StaffMember";
import type { Qualification } from "../../../../../domain/Types/entities/Qualification";
import { useActivateStaffMemberMutation } from "../../../../state-management/mutations/staff-member-mutations/useActivateStaffMemberMutation";
import { useCreateStaffMemberMutation } from "../../../../state-management/mutations/staff-member-mutations/useCreateStaffMemberMutation";
import { useDeactivateStaffMemberMutation } from "../../../../state-management/mutations/staff-member-mutations/useDeactivateStaffMemberMutation";
import { useUpdateStaffQualificationsMutation } from "../../../../state-management/mutations/staff-member-mutations/useUpdateStaffQualificationsMutation";
import type { staffCreateDto } from "../../../../../infrastructure/dtos/staff-member/staffCreateDto";

const MINIMUM_ARRAY_LENGTH = 0;

type StaffMembersWrapper = {
  data: StaffMember[];
};

interface Props {
  staffMembersFromDatabase: StaffMember[];
  qualificationsFromDatabase: Qualification[];
}

const StaffMembers: React.FC<Props> = ({
  staffMembersFromDatabase,
  qualificationsFromDatabase,
}) => {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [creationDialogIsOpen, setCreationDialogIsOpen] =
    useState<boolean>(false);
  const [currentStaffNumber, setCurrentStaffNumber] = useState<number>(0);
  const [isActivating, setIsActivating] = useState<boolean>(false);
  const [updateDialogIsOpen, setUpdateDialogIsOpen] = useState<boolean>(false);
  const [currentStaffMember, setCurrentStaffMember] =
    useState<StaffMember | null>(null);
  const [operationalWindowsDialogOpen, setOperationalWindowsDialogOpen] =
    useState<boolean>(false);
  const [qualificationsDialogOpen, setQualificationsDialogOpen] =
    useState<boolean>(false);
  const [selectedStaffMember, setSelectedStaffMember] =
    useState<StaffMember | null>(null);

  const createStaffMemberMutation = useCreateStaffMemberMutation();
  const deactivateStaffMemberMutation = useDeactivateStaffMemberMutation();
  const activateStaffMemberMutation = useActivateStaffMemberMutation();
  const updateQualificationsMutation = useUpdateStaffQualificationsMutation();

  const staffMembers: StaffMember[] = staffMembersFromDatabase;

  const activeStaffMembers: StaffMembersWrapper = {
    data: staffMembers.filter((s) => s.isActive === true),
  };

  const inactiveStaffMembers: StaffMembersWrapper = {
    data: staffMembers.filter((s) => s.isActive === false),
  };

  const onStaffMemberCreation = async (
    staffMember: staffCreateDto
  ): Promise<void> => {
    try {
      await createStaffMemberMutation.mutateAsync(staffMember);
      handleCreationDialogClose();
    } catch (error) {
      console.error("Error creating staff member:", error);
    }
  };

  const handleCreationDialogOpen = (): void => {
    setCreationDialogIsOpen(true);
  };

  const handleCreationDialogClose = (): void => {
    setCreationDialogIsOpen(false);
  };

  const handleDeactivation = (mNumber: number, willActivate: boolean): void => {
    setCurrentStaffNumber(mNumber);
    setIsActivating(willActivate);
    setConfirmDialogOpen(true);
  };

  const handleStatusChangeConfirmation = async (): Promise<void> => {
    try {
      if (isActivating) {
        await activateStaffMemberMutation.mutateAsync(currentStaffNumber);
      } else {
        await deactivateStaffMemberMutation.mutateAsync(currentStaffNumber);
      }
      setConfirmDialogOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelStatusChange = (): void => {
    setConfirmDialogOpen(false);
  };

  const handleUpdateDialogOpen = (staffMember: StaffMember): void => {
    setCurrentStaffMember(staffMember);
    setUpdateDialogIsOpen(true);
  };

  const handleUpdateDialogClose = (): void => {
    setUpdateDialogIsOpen(false);
    setCurrentStaffMember(null);
  };

  const handleOperationalWindowsClick = (staff: StaffMember): void => {
    setSelectedStaffMember(staff);
    setOperationalWindowsDialogOpen(true);
  };

  const handleOperationalWindowsClose = (): void => {
    setOperationalWindowsDialogOpen(false);
    setSelectedStaffMember(null);
  };

  const handleQualificationsClick = (staff: StaffMember): void => {
    setSelectedStaffMember(staff);
    setQualificationsDialogOpen(true);
  };

  const handleQualificationsClose = (): void => {
    setQualificationsDialogOpen(false);
    setSelectedStaffMember(null);
  };

  const handleQualificationsSave = async (
    qualificationCodes: string[]
  ): Promise<void> => {
    if (!selectedStaffMember) return;

    try {
      await updateQualificationsMutation.mutateAsync({
        mecanographicNumber: selectedStaffMember.mecanographicNumber,
        qualificationCodes,
      });
    } catch (error) {
      console.error("Error updating qualifications:", error);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Active Staff Members
          </Typography>
          <IconButton onClick={handleCreationDialogOpen} color="primary">
            <AddCircleOutlineIcon />
          </IconButton>
        </Box>
        {activeStaffMembers.data.length > MINIMUM_ARRAY_LENGTH ? (
          <StaffMemberTable
            staffMembers={activeStaffMembers}
            isActive={true}
            onStatusChangeClick={(mNumber: number) =>
              handleDeactivation(mNumber, false)
            }
            onUpdateButtonClick={(staffMember: StaffMember) =>
              handleUpdateDialogOpen(staffMember)
            }
            onOperationalWindowsClick={handleOperationalWindowsClick}
            onQualificationsClick={handleQualificationsClick}
          />
        ) : (
          <Typography>No active staff members found!</Typography>
        )}
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Inactive Staff Members
        </Typography>
        {inactiveStaffMembers.data.length > MINIMUM_ARRAY_LENGTH ? (
          <StaffMemberTable
            staffMembers={inactiveStaffMembers}
            isActive={false}
            onStatusChangeClick={(mNumber: number) =>
              handleDeactivation(mNumber, true)
            }
          />
        ) : (
          <Typography>No inactive staff members found!</Typography>
        )}
      </Box>

      <StaffMemberCreationDialog
        onSubmit={onStaffMemberCreation}
        isOpen={creationDialogIsOpen}
        handleClose={handleCreationDialogClose}
      />

      <ConfirmationDialog
        open={confirmDialogOpen}
        title={
          isActivating ? "Activate Staff Member" : "Deactivate Staff Member"
        }
        message={
          isActivating
            ? `Are you sure you want to activate staff member ${currentStaffNumber}?`
            : `Are you sure you want to deactivate staff member ${currentStaffNumber}?`
        }
        onConfirm={handleStatusChangeConfirmation}
        onCancel={handleCancelStatusChange}
        confirmText={isActivating ? "Activate" : "Deactivate"}
        cancelText="Cancel"
      />

      {updateDialogIsOpen && currentStaffMember && (
        <StaffMemberUpdateDialog
          isOpen={updateDialogIsOpen}
          handleClose={handleUpdateDialogClose}
          staffMember={currentStaffMember}
        />
      )}

      <OperationalWindowsDialog
        isOpen={operationalWindowsDialogOpen}
        handleClose={handleOperationalWindowsClose}
        staffMember={selectedStaffMember}
      />

      <StaffQualificationsDialog
        isOpen={qualificationsDialogOpen}
        handleClose={handleQualificationsClose}
        staffMember={selectedStaffMember}
        availableQualifications={qualificationsFromDatabase}
        onSave={handleQualificationsSave}
      />
    </Box>
  );
};

export default StaffMembers;
