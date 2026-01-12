import { Grid } from "@mui/material";
import { useGetAllVesselTypesQuery } from "../../../../../state-management/queries/vessel-type-queries/useGetAllVesselTypesQuery";
import FormInputField from "../../../../../shared/FormComponents/FormInputField/FormInputField";
import VesselTypeDropdown from "../../../../../shared/FormComponents/VesselTypeDropdown/VesselTypeDropdown";
import FormSubmitButton from "../../../../../shared/FormComponents/FormSubmitButton/FormSubmitButton";

export default function DockUpdateFormContent() {
  const { data: vesselTypes = [] } = useGetAllVesselTypesQuery();

  return (
    <Grid marginTop={"1em"} container spacing={2} justifyContent={"center"}>
      <FormInputField required label={"Name"} name={"name"} />
      <FormInputField required label={"Location"} name={"location"} />
      <FormInputField required type={"number"} label={"Length"} name={"length"} />
      <FormInputField required type={"number"} label={"Depth"} name={"depth"} />
      <FormInputField required type={"number"} label={"Max Draft"} name={"maxDraft"} />
      <FormInputField required type={"number"} label={"X"} name={"x"} />
      <FormInputField required type={"number"} label={"Y"} name={"y"} />
      <FormInputField required type={"number"} label={"Z"} name={"z"} />

      <VesselTypeDropdown vesselTypes={vesselTypes} label="Allowed Vessel Types" name="vesselTypeCodes" />

      <FormSubmitButton label={"Update"} />
    </Grid>
  );
}
