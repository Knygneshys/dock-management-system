import { CircularProgress, Grid } from "@mui/material";
import FormDatePickerField from "../../DatePickerField/FormDatePickerField";
import FormTimePickerField from "../../DatePickerField/FormTimePickerField";
import FormSelectField from "../../../../shared/FormComponents/FormSelectField/FormSelectField";
import FormSubmitButton from "../../../../shared/FormComponents/FormSubmitButton/FormSubmitButton";
import type { StaffMember } from "../../../../../domain/Types/entities/StaffMember";
import type { Resource } from "../../../../../domain/Types/entities/Resource";

interface Props {
  staffMembers?: StaffMember[];
  resources?: Resource[];
  isLoading?: boolean;
}

export default function ShiftCreationFormContent({
  staffMembers,
  resources,
  isLoading,
}: Props) {
  if (isLoading) {
    return (
      <Grid container justifyContent="center" padding={3}>
        <CircularProgress />
      </Grid>
    );
  }

  if (!staffMembers || !resources) {
    return (
      <Grid container justifyContent="center" padding={3}>
        <div>Error loading data</div>
      </Grid>
    );
  }

  const staffMemberOptions = staffMembers.map((staff) => ({
    value: staff.mecanographicNumber,
    label: `${staff.name} (${staff.mecanographicNumber})`,
  }));

  const resourceOptions = (resources || []).map((resource: Resource) => ({
    value: resource.alphanumericCode,
    label: `${resource.alphanumericCode} - ${resource.description || ""}`,
  }));

  return (
    <Grid marginTop={"1em"} container spacing={2} justifyContent={"center"}>
      <FormSelectField
        required
        label={"Staff Member"}
        name={"staffMemberId"}
        options={staffMemberOptions}
      />
      <FormSelectField
        required
        label={"Resource"}
        name={"resourceCode"}
        options={resourceOptions}
      />
      <FormDatePickerField required label={"Date"} name={"date"} />
      <FormTimePickerField required label={"From Time"} name={"fromTime"} />
      <FormTimePickerField required label={"To Time"} name={"toTime"} />
      <FormSubmitButton label={"Create Shift"} />
    </Grid>
  );
}
