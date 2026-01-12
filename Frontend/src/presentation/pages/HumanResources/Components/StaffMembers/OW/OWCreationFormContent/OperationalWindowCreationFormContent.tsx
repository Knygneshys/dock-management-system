import { FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";

import type { SelectChangeEvent } from "@mui/material";
import { DAYS_OF_WEEK } from "../../../../../../../domain/Enums/daysOfWeek";

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

const MAX_HOUR = 23;
const MAX_MINUTE = 59;
const MIN_VALUE = 0;

interface OperationalWindowFormValues {
  dayOfWeek: DayOfWeek;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}

interface OperationalWindowCreationDialogContentProps {
  values: OperationalWindowFormValues;
  errors: Partial<Record<keyof OperationalWindowFormValues, string>>;
  touched: Partial<Record<keyof OperationalWindowFormValues, boolean>>;
  handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => void;
  handleBlur: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export default function OperationalWindowCreationDialogContent({
  values,
  errors,
  touched,
  handleChange,
  handleBlur
}: OperationalWindowCreationDialogContentProps) {
  const daysArray = Object.values(DAYS_OF_WEEK);

  return (
    <Grid container spacing={2}>
      <Grid>
        <FormControl fullWidth error={touched.dayOfWeek && Boolean(errors.dayOfWeek)}>
          <InputLabel>Day of Week</InputLabel>
          <Select
            name="dayOfWeek"
            value={values.dayOfWeek}
            onChange={handleChange}
            onBlur={handleBlur}
            label="Day of Week"
          >
            {daysArray.map((day) => (
              <MenuItem key={day} value={day}>
                {day}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid>
        <TextField
          fullWidth
          type="number"
          name="startHour"
          label="Start Hour (0-23)"
          value={values.startHour}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.startHour && Boolean(errors.startHour)}
          helperText={touched.startHour && errors.startHour}
          inputProps={{ min: MIN_VALUE, max: MAX_HOUR }}
        />
      </Grid>

      <Grid>
        <TextField
          fullWidth
          type="number"
          name="startMinute"
          label="Start Minute (0-59)"
          value={values.startMinute}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.startMinute && Boolean(errors.startMinute)}
          helperText={touched.startMinute && errors.startMinute}
          inputProps={{ min: MIN_VALUE, max: MAX_MINUTE }}
        />
      </Grid>

      <Grid>
        <TextField
          fullWidth
          type="number"
          name="endHour"
          label="End Hour (0-23)"
          value={values.endHour}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.endHour && Boolean(errors.endHour)}
          helperText={touched.endHour && errors.endHour}
          inputProps={{ min: MIN_VALUE, max: MAX_HOUR }}
        />
      </Grid>

      <Grid>
        <TextField
          fullWidth
          type="number"
          name="endMinute"
          label="End Minute (0-59)"
          value={values.endMinute}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.endMinute && Boolean(errors.endMinute)}
          helperText={touched.endMinute && errors.endMinute}
          inputProps={{ min: MIN_VALUE, max: MAX_MINUTE }}
        />
      </Grid>
    </Grid>
  );
}
