import { Box, CircularProgress, Typography } from "@mui/material";

import VVNsTable from "./VVNs/VVNsTable/VVNsTable";
import { useGetAllVvnsQuery } from "../../../state-management/queries/vvn-queries/useGetAllVvnsQuery";

export default function VVNs() {
  const { data: vvns, isLoading, isError, error } = useGetAllVvnsQuery();

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    console.error(error);
    return (
      <Typography fontWeight={"bold"} sx={{ width: "25%" }}>
        Fatal Error!
      </Typography>
    );
  }

  return <Box>{vvns ? <VVNsTable vvns={vvns} /> : <Typography>No notifications!</Typography>}</Box>;
}
