import { Grid } from "@mui/material";

import FormInputField
  from "../../../../../../shared/FormComponents/FormInputField/FormInputField";
import FormSubmitButton
  from
  "../../../../../../shared/FormComponents/FormSubmitButton/FormSubmitButton";

export default function QualificationUpdateFormContent() {
  return (
    <Grid
      marginTop={"1em"}
      container
      spacing={2}
      justifyContent={"center"}
    >
      <FormInputField
        required
        label={"Name"}
        name={"name"}
      />
      <FormSubmitButton label={"Update"} />
    </Grid>
  );
}
