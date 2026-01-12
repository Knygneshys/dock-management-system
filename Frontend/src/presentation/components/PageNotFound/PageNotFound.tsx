import { Box, Typography } from "@mui/material";

export default function PageNotFound() {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: 4,
        textAlign: "center",
      }}
    >
      <Typography variant="h1" sx={{ color: "#ca9e0fff", marginTop: 4 }}>
        Page Not Found!
      </Typography>
    </Box>
  );
}