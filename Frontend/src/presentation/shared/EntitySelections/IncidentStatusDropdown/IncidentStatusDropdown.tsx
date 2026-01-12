import { Box, MenuItem, Select } from "@mui/material";
import { useField } from "formik";
import { IncidentStatus } from "../../../../domain/Enums/incidentStatus";

interface Props {
  label: string;
  name: string;
}

export default function IncidentStatusDropdown({ label, ...props }: Props) {
  const [field, meta] = useField(props);
  const incidentStatuses = Object.values(IncidentStatus);

  return (
    <>
      <Select {...field} {...props} label={label} fullWidth>
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {incidentStatuses.map((is) => (
          <MenuItem value={is}>{is}</MenuItem>
        ))}
      </Select>
      {meta.touched && meta.error ? <Box sx={{ color: "red", width: "100%" }}>{meta.error}</Box> : null}
    </>
  );
}
