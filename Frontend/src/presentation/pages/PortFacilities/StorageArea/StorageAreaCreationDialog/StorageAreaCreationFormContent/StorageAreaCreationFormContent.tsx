import { Grid, MenuItem } from "@mui/material";
import FormInputField from "../../../../../shared/FormComponents/FormInputField/FormInputField";
import { storageAreaType } from "../../../../../../domain/Enums/storageAreaType";
import FormSubmitButton from "../../../../../shared/FormComponents/FormSubmitButton/FormSubmitButton";

export default function StorageAreaCreationFormContent() {
  return (
    <Grid marginTop={"1em"} container spacing={2} justifyContent={"center"}>
      <FormInputField required label={"Code"} name={"code"} />
      <FormInputField required label="Type" name="type" select>
        <MenuItem value={storageAreaType.WAREHOUSE}>Warehouse</MenuItem>
        <MenuItem value={storageAreaType.CONTAINER_YARD}>ContainerYard</MenuItem>
      </FormInputField>

      <FormInputField required label={"Location"} name={"location"} />
      <FormInputField required type={"number"} label={"Max Capacity"} name={"maxCapacity"} />
      <FormInputField required type={"number"} label={"Current Occupancy"} name={"currentOccupancy"} />
      <FormInputField required type={"number"} label={"Width"} name={"width"} />
      <FormInputField required type={"number"} label={"Depth"} name={"depth"} />
      <FormInputField required type={"number"} label={"Height"} name={"height"} />
      <FormInputField required type={"number"} label={"X"} name={"x"} />
      <FormInputField required type={"number"} label={"Y"} name={"y"} />
      <FormInputField required type={"number"} label={"Z"} name={"z"} />

      <FormSubmitButton label={"Create"} />
    </Grid>
  );
}
