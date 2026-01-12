import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { resourceType } from "../../../../../domain/Enums/resourceType";

interface Props {
  onChange: (value: any) => void;
  value?: string;
  name?: string;
}

function ResourceTypeSelection({ onChange, ...props }: Props) {
  return (
    <FormControl sx={{ minWidth: 120 }}>
      <InputLabel id="type-label">Type</InputLabel>
      <Select {...props} labelId="type-label" label="Type" {...props} onChange={onChange}>
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

export default ResourceTypeSelection;
