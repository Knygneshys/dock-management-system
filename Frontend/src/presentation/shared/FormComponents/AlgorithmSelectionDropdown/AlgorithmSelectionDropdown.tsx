import { Box, MenuItem, Select } from "@mui/material";
import { algorithmTypes } from "../../../../domain/Enums/algorithmTypes";
import { useField } from "formik";

interface Props {
  label: string;
  name: string;
}

export default function AlgorithmSelectionDropdown({ label, ...props }: Props) {
  const [field, meta] = useField(props);
  const algorithms = Object.values(algorithmTypes);

  return (
    <>
      <Select {...field} {...props} label={label}>
        {algorithms.map((algorithm) => (
          <MenuItem value={algorithm}>{algorithm}</MenuItem>
        ))}
      </Select>
      {meta.touched && meta.error ? (
        <Box sx={{ color: "red", width: "100%" }}>{meta.error}</Box>
      ) : null}
    </>
  );
}
