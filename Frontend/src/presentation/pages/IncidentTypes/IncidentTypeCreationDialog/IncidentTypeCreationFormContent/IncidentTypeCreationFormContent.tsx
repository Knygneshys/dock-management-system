import { Grid } from "@mui/material";
import FormInputField from "../../../../shared/FormComponents/FormInputField/FormInputField";
import FormSubmitButton from "../../../../shared/FormComponents/FormSubmitButton/FormSubmitButton";
import SeverityClassificationDropdown from "../../../../shared/FormComponents/SeverityClassificationDropdown/SeverityClassificationDropdown";

export default function IncidentTypeCreationFormContent() {
  return (
    <Grid marginTop={"1em"} container spacing={2} justifyContent={"center"}>
      <FormInputField required label={"Code"} name={"code"} />
      <FormInputField required label={"Name"} name={"name"} />
      <FormInputField required label={"Description"} name={"description"} />
      <FormInputField
        label={"Parent Incident Type Code"}
        name={"parentIncidentTypeCode"}
      />
      <SeverityClassificationDropdown label={"Severity"} name={"severity"} />
      <FormSubmitButton label={"Create"} />
    </Grid>
  );
}
