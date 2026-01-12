import { Grid } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { useField } from "formik";

interface Props {
  name: string,
  label: string,
  required: boolean,
}

export default function FormDatePickerField({ name, label, required } : Props) {
  const [field, meta, helpers] = useField(name);

  return (
    <Grid>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label={label}
          value={field.value ? dayjs(field.value) : null}
          onChange={(newValue: dayjs.Dayjs | null) => {
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