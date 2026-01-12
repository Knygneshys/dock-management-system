/* eslint-disable max-len */
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useField } from "formik";
import { resourceStatus } from "../../../../domain/Enums/resourceStatus";

function ResourceStatusFormSelection({ ...props }) {
  const [field, meta] = useField(props.name);

  return (
    <FormControl sx={{ width: "100%" }}>
      <InputLabel id="type-label">Status</InputLabel>
      <Select
        {...field}
        {...props}
        error={meta.touched && Boolean(meta.error)}
        // @ts-ignore
        helperText={meta.touched && meta.error}
        labelId="type-label"
        label="Type"
      >
        <MenuItem value={resourceStatus.ACTIVE}>{resourceStatus.ACTIVE}</MenuItem>
        <MenuItem value={resourceStatus.INACTIVE}>{resourceStatus.INACTIVE}</MenuItem>
        <MenuItem value={resourceStatus.MAINTENENCE}>{resourceStatus.MAINTENENCE}</MenuItem>
      </Select>
    </FormControl>
  );
}

export default ResourceStatusFormSelection;
