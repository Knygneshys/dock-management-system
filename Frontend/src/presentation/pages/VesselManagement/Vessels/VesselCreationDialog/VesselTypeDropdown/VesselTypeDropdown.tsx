import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useField } from "formik";
import type { VesselType } from "../../../../../../domain/Types/entities/VesselType";

interface Props {
  vesselTypes: VesselType[];
  label: string;
  name: string;
  required: boolean;
}

export default function VesselTypeDropdown({
  vesselTypes,
  label,
  name,
  ...props
}: Props) {
  const [field, meta] = useField(name);
  const hasError = meta.touched && Boolean(meta.error);

  return (
    <>
      <FormControl fullWidth error={hasError} variant="outlined">
        <InputLabel>{label}</InputLabel>

        <Select {...field} {...props} label={label}>
          {vesselTypes.map((vesselType) => {
            return (
              <MenuItem key={vesselType.code} value={vesselType.code}>
                {vesselType.name}
              </MenuItem>
            );
          })}
        </Select>
        {hasError && <FormHelperText>{meta.error}</FormHelperText>}
      </FormControl>
    </>
  );
}
