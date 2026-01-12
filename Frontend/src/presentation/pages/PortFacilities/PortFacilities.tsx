import { Box, Tab, Tabs } from "@mui/material";
import React from "react";
import DockRecords from "./DockRecord/DockRecord";
import StorageAreas from "./StorageArea/StorageArea";
import { useGetAllStorageAreasQuery } from "../../state-management/queries/storage-area-queries/useGetAllStorageAreasQuery";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { useGetAllDockRecordsQuery } from "../../state-management/queries/dock-record-queries/useGetAllDockRecordsQuery";

const TABS = {
  DOCKS: 0,
  STORAGE: 1,
};

export default function PortFacilities() {
  const [tab, setTab] = React.useState(TABS.DOCKS);

  const getAllStorageAreasQuery = useGetAllStorageAreasQuery();
  const storageAreas = getAllStorageAreasQuery?.data;

  const getAllDockRecordsQuery = useGetAllDockRecordsQuery();
  const dockRecords = getAllDockRecordsQuery?.data;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  if (
    getAllStorageAreasQuery.isLoading || 
    getAllDockRecordsQuery.isLoading || 
    storageAreas === undefined || 
    dockRecords === undefined
  ) {
    return <LoadingScreen />;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Dock Records" value={TABS.DOCKS} />
        <Tab label="Storage Areas" value={TABS.STORAGE} />
      </Tabs>
      {tab === TABS.DOCKS && <DockRecords dockRecordsFromDatabase={dockRecords} />}
      {tab === TABS.STORAGE && <StorageAreas storageAreasFromDatabase={storageAreas} />}
    </Box>
  );
}