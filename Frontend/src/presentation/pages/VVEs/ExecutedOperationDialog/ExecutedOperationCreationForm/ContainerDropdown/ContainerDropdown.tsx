import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useField } from "formik";

interface Props {
  label: string;
  name: string;
  containers: string[];
}

export default function ContainerDropdown({
  label,
  name,
  containers,
  ...props
}: Props) {
  const [field, meta] = useField(name);
  const hasError = meta.touched && Boolean(meta.error);

  return (
    <>
      <FormControl fullWidth error={hasError} variant="outlined">
        <InputLabel>{label}</InputLabel>

        <Select {...field} {...props} label={label}>
          {containers.map((container: string) => {
            return (
              <MenuItem key={container} value={container}>
                {container}
              </MenuItem>
            );
          })}
        </Select>
        {hasError && <FormHelperText>{meta.error}</FormHelperText>}
      </FormControl>
    </>
  );
}
