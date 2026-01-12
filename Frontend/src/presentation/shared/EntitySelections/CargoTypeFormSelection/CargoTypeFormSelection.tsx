import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { useField } from "formik";
import { cargoType } from "../../../../domain/Enums/cargoType";

function CargoTypeFormSelection({ ...props }) {
  const [field, meta] = useField(props.name);

  return (
    <FormControl sx={{ width: "100%" }} error={meta.touched && Boolean(meta.error)}>
      <InputLabel id="type-label">Cargo Type</InputLabel>
      <Select {...field} {...props} labelId="type-label" label="Cargo Type">
        <MenuItem value={cargoType.Dry}>{cargoType.Dry}</MenuItem>
        <MenuItem value={cargoType.General}>{cargoType.General}</MenuItem>
        <MenuItem value={cargoType.Hazardous}>{cargoType.Hazardous}</MenuItem>
        <MenuItem value={cargoType.Liquid}>{cargoType.Liquid}</MenuItem>
        <MenuItem value={cargoType.Refrigerated}>{cargoType.Refrigerated}</MenuItem>
      </Select>
      {meta.touched && meta.error && <FormHelperText>{meta.error}</FormHelperText>}
    </FormControl>
  );
}

export default CargoTypeFormSelection;
