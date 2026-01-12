import { Grid, TextField } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import type { operationalWindowFormDto } from "../../../../../../../../infrastructure/dtos/operational-window/OperationalWindowFormDto";

const MAX_HOUR = 23;
const MAX_MINUTE = 59;
const MIN_VALUE = 0;

interface OperationalWindowUpdateFormContentProps {
  values: operationalWindowFormDto;
  errors: Partial<Record<keyof operationalWindowFormDto, string>>;
  touched: Partial<Record<keyof operationalWindowFormDto, boolean>>;
  handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => void;
  handleBlur: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export default function OperationalWindowUpdateFormContent({
  values,
  errors,
  touched,
  handleChange,
  handleBlur
}: OperationalWindowUpdateFormContentProps) {
  return (
    <Grid container spacing={2}>
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
