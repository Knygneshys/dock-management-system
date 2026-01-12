import {
  Checkbox,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";
import { useField } from "formik";
import type { SelectChangeEvent } from "@mui/material/Select";
import { useGetAllQualificationsQuery } from "../../../../../../state-management/queries/qualification-queries/useGetAllQualificationsQuery";
import type { Qualification } from "../../../../../../../domain/Types/entities/Qualification";

interface QualificationsMultiSelectProps {
  name: string;
  label: string;
  required?: boolean;
}

export default function QualificationsMultiSelect({
  name,
  label,
  required,
}: QualificationsMultiSelectProps) {
  const [field, meta, helpers] = useField<string[]>(name);
  const { data: qualificationsData } = useGetAllQualificationsQuery();

  const qualifications: Qualification[] = qualificationsData || [];
  const { setValue } = helpers;

  const value = field.value || [];
  const { error, touched } = meta;

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const selected = event.target.value as string[];
    setValue(selected);
  };

  const verification = -1;

  return (
    <FormControl
      fullWidth
      error={touched && Boolean(error)}
      required={required}
    >
      <InputLabel>{label}</InputLabel>

      <Select
        multiple
        value={value}
        onChange={handleChange}
        renderValue={(selected) => {
          const selectedNames = (selected as string[]).map((code) => {
            const qual = qualifications.find((q) => q.code === code);
            return qual ? qual.name : code;
          });
          return selectedNames.join(", ");
        }}
        label={label}
      >
        {qualifications.map((qualification) => (
          <MenuItem key={qualification.code} value={qualification.code}>
            <Checkbox
              checked={value?.indexOf(qualification.code) > verification}
            />
            <ListItemText
              primary={`${qualification.code} - ${qualification.name}`}
            />
          </MenuItem>
        ))}
      </Select>

      {touched && error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}
