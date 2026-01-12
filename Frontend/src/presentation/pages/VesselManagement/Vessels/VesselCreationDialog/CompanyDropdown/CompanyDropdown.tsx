import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useField } from "formik";
import type { Company } from "../../../../../../domain/Types/entities/Company";

interface Props {
  companies: Company[];
  label: string;
  name: string;
  required?: boolean;
}

export default function CompanyDropdown({
  companies,
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
          {companies.map((company: Company) => {
            return (
              <MenuItem key={company.code} value={company.code}>
                {company.name}
              </MenuItem>
            );
          })}
        </Select>
        {hasError && <FormHelperText>{meta.error}</FormHelperText>}
      </FormControl>
    </>
  );
}
