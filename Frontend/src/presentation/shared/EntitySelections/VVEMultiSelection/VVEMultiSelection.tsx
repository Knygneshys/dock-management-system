import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Theme,
  Typography,
  useTheme
} from "@mui/material";
import { VVE } from "../../../../domain/Types/entities/VVE";
import { useField } from "formik";

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

interface VVEMultiSelectionProps {
  name: string;
  label?: string;
  required?: boolean;
  vves: VVE[];
}

function VVEMultiSelection(props: VVEMultiSelectionProps) {
  const [field, meta, helpers] = useField<number[]>(props.name);
  const { setValue } = helpers;

  const theme = useTheme();

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value }
    } = event;

    const stringValues = typeof value === "string" ? value.split(",") : value;

    const numberValues = stringValues.map(Number).filter(Number.isFinite);

    setValue(numberValues);
  };

  const selected = field.value ?? [];

  return (
    <FormControl fullWidth error={meta.touched && Boolean(meta.error)}>
      <InputLabel id="vve-label">VVE</InputLabel>

      <Select
        labelId="vve-label"
        multiple
        value={selected.map(String)}
        onChange={handleChange}
        input={<OutlinedInput label="VVE" />}
        renderValue={(selectedValues) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {(selectedValues as string[]).map((value) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
        MenuProps={MenuProps}
      >
        {props.vves.length ? (
          props.vves.map((vve) => (
            <MenuItem
              key={vve.code}
              value={String(vve.code)}
              style={getStyles(String(vve.code), selected.map(String), theme)}
            >
              {vve.code} - {vve.vesselImo}
            </MenuItem>
          ))
        ) : (
          <Typography>No VVE's found!</Typography>
        )}
      </Select>
    </FormControl>
  );
}

export default VVEMultiSelection;
