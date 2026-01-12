import { FormControl, InputLabel, MenuItem, Select, FormHelperText } from "@mui/material";
import { useField } from "formik";
import { IncidentType } from "../../../../domain/Types/entities/IncidentType";

interface IncidentTypeSelectionProps {
  name: string;
  label?: string;
  types: IncidentType[];
  required?: boolean;
}

function IncidentTypeSelection({ name, label = "Incident Type", types, required = false }: IncidentTypeSelectionProps) {
  const [field, meta] = useField(name);

  const hasError = meta.touched && Boolean(meta.error);

  return (
    <FormControl fullWidth error={hasError} required={required}>
      <InputLabel id={`${name}-label`}>{label}</InputLabel>

      <Select {...field} labelId={`${name}-label`} label={label}>
        <MenuItem value="">
          <em>None</em>
        </MenuItem>

        {types.map((t) => (
          <MenuItem key={t.code} value={t.code}>
            {t.name} - {t.severity}
          </MenuItem>
        ))}
      </Select>

      {hasError && <FormHelperText>{meta.error}</FormHelperText>}
    </FormControl>
  );
}

export default IncidentTypeSelection;
