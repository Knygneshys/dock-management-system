import { useField } from "formik";
import { VVE } from "../../../../domain/Types/entities/VVE";
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";

interface VVESelectionProps {
  name: string;
  label?: string;
  vves: VVE[];
  required?: boolean;
}

function VVESelection({ name, label = "VVE", vves, required = false }: VVESelectionProps) {
  const [field, meta] = useField(name);

  const hasError = meta.touched && Boolean(meta.error);

  return (
    <FormControl fullWidth error={hasError} required={required}>
      <InputLabel id={`${name}-label`}>{label}</InputLabel>

      <Select {...field} labelId={`${name}-label`} label={label}>
        <MenuItem value="">
          <em>None</em>
        </MenuItem>

        {vves.map((vve) => (
          <MenuItem key={vve.code} value={vve.code}>
            {vve.code} - {vve.vesselImo}
          </MenuItem>
        ))}
      </Select>

      {hasError && <FormHelperText>{meta.error}</FormHelperText>}
    </FormControl>
  );
}

export default VVESelection;
