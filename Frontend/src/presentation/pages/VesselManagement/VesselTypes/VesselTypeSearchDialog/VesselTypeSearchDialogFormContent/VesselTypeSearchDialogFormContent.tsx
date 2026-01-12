import { Grid } from "@mui/material";

import FormFilterOperatorDropdown
  from "../../../../../shared/FormComponents/FormFilterOperatorDropdown/FormFilterOperatorDropdown";
import FormInputField
  from "../../../../../shared/FormComponents/FormInputField/FormInputField";
import FormSubmitButton
  from "../../../../../shared/FormComponents/FormSubmitButton/FormSubmitButton";

export default function VesselTypeSearchDialogFormContent() {
  return (
    <Grid
      marginTop={"1em"}
      container
      spacing={2}
      justifyContent={"center"}
    >
      <FormInputField
        label={"Name"}
        name={"name"}
      />
      <FormInputField
        label={"Description"}
        name={"description"}
      />
      <FormFilterOperatorDropdown
        label={"Filter Operator"}
        name={"filterOperator"}
      />
      <FormSubmitButton label={"Search"} />
    </Grid>
  );
}
