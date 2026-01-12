import { createTheme } from "@mui/material/styles";
import { accentColor, primaryColor, secondaryColor } from "./colorscheme";


export const theme = createTheme({
  palette: {
    primary: { main: primaryColor },
    secondary: { main: secondaryColor },
    warning: { main: accentColor },
    success: { main: "#87e78bff" },
    error: { main: "#eb7970ff" },
    background: { default: "#f9fafb" },
    text: { primary: "#1e293b" },
  },
});
