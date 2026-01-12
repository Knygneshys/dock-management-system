import { Box, Stack, Typography } from "@mui/material";

function VVNEntriesHeader() {
  return (
    <Stack direction="row" spacing={2} marginBottom={3} padding={2}>
      <Box sx={{ width: "8%", overflow: "hidden" }}>
        <Typography>Code</Typography>
      </Box>
      <Box sx={{ width: "15%", overflow: "hidden" }}>
        <Typography>ETA</Typography>
      </Box>
      <Box sx={{ width: "15%", overflow: "hidden" }}>
        <Typography>ETD</Typography>
      </Box>
      <Box sx={{ width: "21%" }}>
        <Typography>Vessel</Typography>
      </Box>
      <Box sx={{ width: "21%", overflow: "hidden" }}>
        <Typography>Representative</Typography>
      </Box>
      <Box sx={{ width: "10%", overflow: "hidden" }}>
        <Typography>Company</Typography>
      </Box>
      <Box sx={{ width: "10%", overflow: "hidden" }}>
        <Typography>Status</Typography>
      </Box>
    </Stack>
  );
}

export default VVNEntriesHeader;
