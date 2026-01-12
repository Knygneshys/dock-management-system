import { Grid, MenuItem, TextField } from "@mui/material";
import { useField } from "formik";

interface Props {
  name: string;
  label: string;
  required: boolean;
  options: {
    value: number | string;
    label: string;
  }[];
}

export default function FormSelectField({
  name,
  label,
  required,
  options,
}: Props) {
  const [field, meta] = useField(name);

  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <TextField
        {...field}
        select
        fullWidth
        label={label}
        required={required}
        error={meta.touched && Boolean(meta.error)}
        helperText={meta.touched && meta.error}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </Grid>
  );
}
