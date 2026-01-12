import { Box, CircularProgress } from "@mui/material";

export default function LoadingScreen() {
  return <Box sx={{
    height: "100vh",
    width: "100wh",
    textAlign: "center",
    alignContent: "center",
  }}>
    <CircularProgress />
  </Box>;
}
