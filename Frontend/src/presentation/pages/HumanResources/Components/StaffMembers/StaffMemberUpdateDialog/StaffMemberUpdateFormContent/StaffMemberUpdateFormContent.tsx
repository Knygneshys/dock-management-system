import { Grid } from "@mui/material";

import FormInputField
  from "../../../../../../shared/FormComponents/FormInputField/FormInputField";
import FormSubmitButton
  from
  "../../../../../../shared/FormComponents/FormSubmitButton/FormSubmitButton";

export default function StaffMemberUpdateFormContent() {
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
      <FormInputField
        required
        label={"Email"}
        name={"email"}
      />
      <FormInputField
        required
        label={"Phone"}
        name={"phone"}
      />
      <FormSubmitButton label={"Update"} />
    </Grid>
  );
}
