import { Grid } from "@mui/material";
import FormInputField from "../../../../../shared/FormComponents/FormInputField/FormInputField";
import FormFilterOperatorDropdown from "../../../../../shared/FormComponents/FormFilterOperatorDropdown/FormFilterOperatorDropdown";
import FormSubmitButton from "../../../../../shared/FormComponents/FormSubmitButton/FormSubmitButton";

export default function StorageAreaSearchDialogFormContent() {
  return (
    <Grid marginTop={"1em"} container spacing={2} justifyContent={"center"}>
      <FormInputField label={"Type"} name={"type"} />
      <FormInputField label={"Location"} name={"location"} />
      <FormFilterOperatorDropdown label={"Filter Operator"} name={"filterOperator"} />
      <FormSubmitButton label={"Search"} />
    </Grid>
  );
}
