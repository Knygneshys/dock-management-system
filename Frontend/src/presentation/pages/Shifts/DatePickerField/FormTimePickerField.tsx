import { Grid } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import { useField } from "formik";

interface Props {
  name: string,
  label: string,
  required: boolean,
}

export default function FormTimePickerField({ name, label, required } : Props) {
  const [field, meta, helpers] = useField(name);

  return (
    <Grid>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          label={label}
          value={field.value ? dayjs(field.value) : null}
          onChange={(newValue) => {
            helpers.setValue(newValue);
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              required: required,
              error: meta.touched && Boolean(meta.error),
              helperText: meta.touched && meta.error,
            },
          }}
        />
      </LocalizationProvider>
    </Grid>
  );
}