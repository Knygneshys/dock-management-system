import { Grid } from "@mui/material";

import FormInputField from "../../../../../shared/FormComponents/FormInputField/FormInputField";
import FormSubmitButton from "../../../../../shared/FormComponents/FormSubmitButton/FormSubmitButton";

export default function VesselTypeCreationFormContent() {
  return (
    <Grid marginTop={"1em"} container spacing={2} justifyContent={"center"}>
      <FormInputField required label={"Code"} name={"code"} />
      <FormInputField required label={"Name"} name={"name"} />
      <FormInputField required label={"Description"} name={"description"} />
      <FormInputField
        required
        type={"number"}
        label={"Capacity"}
        name={"capacity"}
      />
      <FormInputField
        required
        type={"number"}
        label={"Max Rows"}
        name={"maxRows"}
      />
      <FormInputField
        required
        type={"number"}
        label={"Max Bays"}
        name={"maxBays"}
      />
      <FormInputField
        required
        type={"number"}
        label={"Max Tiers"}
        name={"maxTiers"}
      />
      <FormInputField
        required
        type={"number"}
        label={"Length"}
        name={"length"}
      />
      <FormInputField required type={"number"} label={"Draft"} name={"draft"} />
      <FormSubmitButton label={"Create"} />
    </Grid>
  );
}
