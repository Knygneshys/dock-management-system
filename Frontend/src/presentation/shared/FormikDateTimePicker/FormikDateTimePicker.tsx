import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Field, FieldProps } from "formik";
import dayjs, { Dayjs } from "dayjs";
import { FormControl, FormHelperText } from "@mui/material";

interface FormikDateTimePickerProps {
  name: string;
  label: string;
}

export const FormikDateTimePicker = ({
  name,
  label,
}: FormikDateTimePickerProps) => {
  return (
    <Field name={name}>
      {({ field, form, meta }: FieldProps) => (
        <FormControl fullWidth error={meta.touched && Boolean(meta.error)}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label={label}
              value={field.value ? dayjs(field.value) : null}
              onChange={(newValue: Dayjs | null) => {
                form.setFieldValue(
                  field.name,
                  newValue ? newValue.toISOString() : null,
                );
              }}
              slotProps={{
                textField: {
                  error: meta.touched && Boolean(meta.error),
                  onBlur: () => form.setFieldTouched(field.name, true),
                },
              }}
            />
          </LocalizationProvider>
          {meta.touched && meta.error && (
            <FormHelperText>{meta.error}</FormHelperText>
          )}
        </FormControl>
      )}
    </Field>
  );
};
