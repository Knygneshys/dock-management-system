import { Grid } from "@mui/material";

import SelectQualificationsDropdown from
  "../../../../../../shared/EntitySelections/SelectQualificationsDropdown/SelectQualificationsDropdown";
import FormInputField
  from "../../../../../../shared/FormComponents/FormInputField/FormInputField";
import FormSubmitButton
  from "../../../../../../shared/FormComponents/FormSubmitButton/FormSubmitButton";

export default function StaffMemberCreationFormContent() {
  return (
    <Grid
      marginTop={"1em"}
      container
      spacing={2}
      justifyContent={"center"}
    >
      <FormInputField
        required
        label="Mecanographic Number"
        name="mecanographicNumber"
      />
      <FormInputField
        required
        label="Name"
        name="name"
      />
      <FormInputField
        required
        label="Email"
        name="email"
      />
      <FormInputField
        required
        label="Phone"
        name="phone"
      />
      <Grid sx={{ flexBasis: "100%" }}>
        <SelectQualificationsDropdown
          name="qualificationCodes"
          label="Qualifications"
          required
        />
    </Grid>
      <FormSubmitButton label="Create" />
    </Grid>
  );
}
