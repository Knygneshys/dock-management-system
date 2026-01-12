import {
  Checkbox,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";
import { useField, useFormikContext } from "formik";
import type { VesselType } from "../../../../domain/Types/entities/VesselType";

interface Props {
  vesselTypes: VesselType[];
  label: string;
  name: string;
  multiple?: boolean;
}
interface HandleChangeEvent {
  target: {
    value: string | string[];
  };
}

export default function VesselTypeDropdown({
  vesselTypes,
  label,
  name,
  multiple = true,
}: Props) {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);
  const hasError = meta.touched && Boolean(meta.error);

  const handleChange = (event: HandleChangeEvent) => {
    const { value } = event.target;
    setFieldValue(name, typeof value === "string" ? value.split(",") : value);
  };

  return (
    <FormControl fullWidth error={hasError} variant="outlined" margin="normal">
      <InputLabel>{label}</InputLabel>

      <Select
        {...field}
        multiple={multiple}
        value={field.value || []}
        onChange={handleChange}
        label={label}
        renderValue={(selected) =>
          selected
            .map(
              (code: string) =>
                vesselTypes.find((v) => v.code === code)?.code ?? code,
            )
            .join(", ")
        }
      >
        {vesselTypes.map((vesselType) => (
          <MenuItem key={vesselType.code} value={vesselType.code}>
            <Checkbox checked={field.value.includes(vesselType.code)} />
            <ListItemText primary={vesselType.code} />
          </MenuItem>
        ))}
      </Select>

      {hasError && <FormHelperText>{meta.error}</FormHelperText>}
    </FormControl>
  );
}
