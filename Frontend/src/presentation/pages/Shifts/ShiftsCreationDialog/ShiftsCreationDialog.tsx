import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import ShiftCreationForm from "./ShiftCreationForm/ShiftCreationForm";
import type { ShiftCreateDto } from "../../../../infrastructure/dtos/shift/shiftCreateDto";
import { useCreateShiftMutation } from "../../../state-management/mutations/shift-mutations/useCreateShiftMutation";
import { useGetAllStaffMembersQuery } from "../../../state-management/queries/staff-member-queries/useGetAllStaffMembersQuery";
import type { StaffMember } from "../../../../domain/Types/entities/StaffMember";
import type { Resource } from "../../../../domain/Types/entities/Resource";
import { useGetAllResourcesQuery } from "../../../state-management/queries/resource-queries/useGetAllResourcesQuery";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ShiftCreationDialog({ open, onClose }: Props) {
  const createShiftMutation = useCreateShiftMutation();
  const { data: staffMembersData, isLoading: isLoadingStaff } =
    useGetAllStaffMembersQuery();
  const { data: resourcesData, isLoading: isLoadingResources } =
    useGetAllResourcesQuery("");

  const staffMembers = staffMembersData as StaffMember[] | undefined;
  const resources = resourcesData as Resource[] | undefined;
  const isLoading = isLoadingStaff || isLoadingResources;

  const handleSubmit = (shiftCreateDto: ShiftCreateDto, mNumber: number) => {
    createShiftMutation.mutate(
      { mNumber, shift: shiftCreateDto },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create Shift</DialogTitle>
      <DialogContent>
        <ShiftCreationForm
          onSubmit={handleSubmit}
          staffMembers={staffMembers}
          resources={resources}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
