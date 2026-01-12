import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useField, useFormikContext } from "formik";

interface Props {
  options: (string | number)[];
  label: string;
  name: string;
  multiple?: boolean;
}

export default function FormMultiselectField({
  options,
  label,
  name,
  multiple = true,
}: Props) {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);
  const hasError = meta.touched && Boolean(meta.error);

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    const { value } = event.target;
    setFieldValue(name, typeof value === "string" ? value.split(",") : value);
  };

  return (
    <FormControl fullWidth error={hasError} variant="outlined" margin="normal">
      <InputLabel id={`${name}-label`}>{label}</InputLabel>

      <Select
        {...field}
        labelId={`${name}-label`}
        multiple={multiple}
        value={field.value || []}
        onChange={handleChange}
        label={label}
        renderValue={(selected) => {
          return Array.isArray(selected) ? selected.join(", ") : selected;
        }}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
      {hasError && <FormHelperText>{meta.error}</FormHelperText>}
    </FormControl>
  );
}
