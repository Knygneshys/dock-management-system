import { Grid } from "@mui/material";
import FormInputField from "../../../../shared/FormComponents/FormInputField/FormInputField";
import FormSubmitButton from "../../../../shared/FormComponents/FormSubmitButton/FormSubmitButton";
import SeverityClassificationDropdown from "../../../../shared/FormComponents/SeverityClassificationDropdown/SeverityClassificationDropdown";

export default function IncidentSearchFormContent() {
  {
    return (
      <Grid marginTop={"1em"} container spacing={2} justifyContent={"center"}>
        <FormInputField label={"Code"} name={"code"} />
        <FormInputField label={"Description"} name={"description"} />
        <FormInputField
          label={"Parent Incident Type Code"}
          name={"parentIncidentTypeCode"}
        />
        <SeverityClassificationDropdown label={"Severity"} name={"severity"} />
        <FormSubmitButton label={"Search"} />
      </Grid>
    );
  }
}
