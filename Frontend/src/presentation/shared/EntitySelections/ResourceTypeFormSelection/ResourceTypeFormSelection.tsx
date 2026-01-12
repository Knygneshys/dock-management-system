/* eslint-disable max-len */
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useField } from "formik";
import { resourceType } from "../../../../domain/Enums/resourceType";

function ResourceTypeFormSelection({ ...props }) {
  const [field, meta] = useField(props.name);

  return (
    <FormControl sx={{ width: "100%" }}>
      <InputLabel id="type-label">Type</InputLabel>
      <Select
        {...field}
        {...props}
        error={meta.touched && Boolean(meta.error)}
        // @ts-ignore
        helperText={meta.touched && meta.error}
        labelId="type-label"
        label="Type"
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value={resourceType.STS_CRANE}>{resourceType.STS_CRANE}</MenuItem>
        <MenuItem value={resourceType.TERMINAL_TRUCK}>{resourceType.TERMINAL_TRUCK}</MenuItem>
        <MenuItem value={resourceType.YARD_CRANE}>{resourceType.YARD_CRANE}</MenuItem>
      </Select>
    </FormControl>
  );
}

export default ResourceTypeFormSelection;
