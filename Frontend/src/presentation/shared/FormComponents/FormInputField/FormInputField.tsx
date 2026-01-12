import { TextField } from "@mui/material";
import { useField } from "formik";
import type { ReactNode } from "react";

interface Props {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  select?: boolean;
  children?: ReactNode;
  disabled?: boolean;
  id?: string;
  multiline?: boolean;
  rows?: number;
  value?: string;
  onChange?: (e: any) => void;
}

export default function FormInputField({ label, name, ...props }: Props) {
  const [field, meta] = useField(name);

  return (
    <>
      <TextField
        {...field}
        {...props}
        label={label}
        fullWidth
        error={meta.touched && Boolean(meta.error)}
        helperText={meta.touched && meta.error ? meta.error : " "}
      />
    </>
  );
}
