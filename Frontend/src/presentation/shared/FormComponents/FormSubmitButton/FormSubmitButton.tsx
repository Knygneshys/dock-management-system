import { Button } from "@mui/material";
import { accentColor } from "../../../constants/colorscheme";

interface Props {
  label: string;
  disabled?: boolean;
}

export default function FormSubmitButton({ label }: Props) {
  return (
    <Button type="submit" variant="contained" fullWidth sx={{ backgroundColor: accentColor }}>
      {label}
    </Button>
  );
}
