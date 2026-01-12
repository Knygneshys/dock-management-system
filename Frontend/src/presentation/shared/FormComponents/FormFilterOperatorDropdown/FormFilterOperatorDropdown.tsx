import { Box, MenuItem, Select } from "@mui/material";
import { useField } from "formik";
import { filterOperator } from "../../../../domain/Enums/filterOperator";

interface Props {
  label: string;
  name: string;
}

export default function FormFilterOperatorDropdown({ label, ...props }: Props) {
  const [field, meta] = useField(props);

  return (
    <>
      <Select {...field} {...props} label={label}>
        <MenuItem value={filterOperator.EQUALS}>Equals</MenuItem>
        <MenuItem value={filterOperator.CONTAINS}>Contains</MenuItem>
      </Select>
      {meta.touched && meta.error ? (
        <Box sx={{ color: "red", width: "100%" }}>{meta.error}</Box>
      ) : null}
    </>
  );
}
