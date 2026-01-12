import { Box, Typography } from "@mui/material";

export default function ForbidScreen() {
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
      <Typography variant="h1" sx={{ color: "#a71a1aff", marginTop: 4 }}>
        FORBIDDEN!
      </Typography>
    </Box>
  );
}