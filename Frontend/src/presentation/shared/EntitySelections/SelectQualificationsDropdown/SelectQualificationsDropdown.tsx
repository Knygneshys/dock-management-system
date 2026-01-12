/* eslint-disable max-len */
import {
  Box,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
  useTheme
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import type { Theme } from "@mui/material/styles";
import { useField } from "formik";
import { useGetAllQualificationsQuery } from "../../../state-management/queries/qualification-queries/useGetAllQualificationsQuery";
import { secondaryColor } from "../../../constants/colorscheme";

const ITEM_HEIGHT = 48;
const HEIGHT_MUL = 4.5;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * HEIGHT_MUL + ITEM_PADDING_TOP,
      width: 250
    }
  }
} as const;

function getStyles(code: string, selectedCodes: string[], theme: Theme) {
  return {
    fontWeight: selectedCodes.includes(code) ? theme.typography.fontWeightMedium : theme.typography.fontWeightRegular
  };
}

interface SelectQualificationsDropdownProps {
  name: string;
  label?: string;
  required?: boolean;
}

function SelectQualificationsDropdown(props: SelectQualificationsDropdownProps) {
  const [field, meta, helpers] = useField<string[]>(props.name);
  const { setValue } = helpers;

  const theme = useTheme();

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value }
    } = event;

    const selectedValues = typeof value === "string" ? value.split(",") : value;
    setValue(selectedValues as string[]);
  };

  const getAllQualificationsQuery = useGetAllQualificationsQuery();
  const qualifications = getAllQualificationsQuery.data ?? [];

  const selected = field.value ?? [];

  return (
    <div>
      <FormControl sx={{ width: "100%" }}>
        <InputLabel id="qualifications-label">Qualification</InputLabel>
        <Select
          {...field}
          {...props}
          error={meta.touched && Boolean(meta.error)}
          labelId="qualifications-label"
          id="qualifications"
          multiple
          value={selected}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Qualification" />}
          renderValue={(selectedValues) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {(selectedValues as string[]).map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {qualifications.length ? (
            qualifications.map((q) => (
              <MenuItem key={q.code} value={q.code} style={getStyles(q.code, selected, theme)}>
                {q.name}
              </MenuItem>
            ))
          ) : (
            <Typography>No qualifications found!</Typography>
          )}

          {getAllQualificationsQuery.isLoading && (
            <Box sx={{ p: 1, display: "flex", justifyContent: "center" }}>
              <CircularProgress sx={{ color: secondaryColor }} size={24} />
            </Box>
          )}
        </Select>
      </FormControl>
    </div>
  );
}

export default SelectQualificationsDropdown;
