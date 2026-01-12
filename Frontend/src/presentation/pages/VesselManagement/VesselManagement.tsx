import { Stack } from "@mui/material";

import Vessels from "./Vessels/Vessels";
import VesselTypes from "./VesselTypes/VesselTypes";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { useGetAllVesselTypesQuery } from "../../state-management/queries/vessel-type-queries/useGetAllVesselTypesQuery";

export default function VesselManagement() {
  const getAllVesselTypesQuery = useGetAllVesselTypesQuery();

  const vesselTypes = getAllVesselTypesQuery?.data;

  if (getAllVesselTypesQuery.isLoading || vesselTypes === undefined) {
    return <LoadingScreen />;
  }

  return (
    <Stack spacing={4}>
      <VesselTypes vesselTypesFromDatabase={vesselTypes} />
      <Vessels vesselTypes={vesselTypes} />
    </Stack>
  );
}
