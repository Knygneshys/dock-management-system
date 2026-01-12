import { Box, InputLabel, MenuItem, Select } from "@mui/material";
import { useField } from "formik";
import { SeverityClassification } from "../../../../domain/Enums/severityClassification";

interface Props {
  label: string;
  name: string;
}

export default function SeverityClassificationDropdown({ label, ...props }: Props) {
  const [field, meta] = useField(props);
  const severityClassifications = Object.values(SeverityClassification);

  return (
    <>
      <Select {...field} {...props} label={label} fullWidth>
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {severityClassifications.map((sc) => (
          <MenuItem value={sc}>{sc}</MenuItem>
        ))}
      </Select>
      {meta.touched && meta.error ? <Box sx={{ color: "red", width: "100%" }}>{meta.error}</Box> : null}
    </>
  );
}
