import { Grid } from "@mui/material";
import FormInputField from "../../../../../shared/FormComponents/FormInputField/FormInputField";
import FormFilterOperatorDropdown from "../../../../../shared/FormComponents/FormFilterOperatorDropdown/FormFilterOperatorDropdown";
import FormSubmitButton from "../../../../../shared/FormComponents/FormSubmitButton/FormSubmitButton";

export default function DockRecordSearchDialogFormContent() {
  return (
    <Grid marginTop={"1em"} container spacing={2} justifyContent={"center"}>
      <FormInputField label={"Name"} name={"name"} />
      <FormInputField label={"Location"} name={"location"} />
      <FormInputField label={"VesselType"} name={"vesselType"} />
      <FormFilterOperatorDropdown label={"Filter Operator"} name={"filterOperator"} />
      <FormSubmitButton label={"Search"} />
    </Grid>
  );
}
