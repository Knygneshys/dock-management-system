import { Box } from "@mui/material";
import StaffMembers from "./Components/StaffMembers/StaffMembers";
import Qualifications from "./Components/Qualifications/Qualifications";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { useGetAllStaffMembersQuery } from "../../state-management/queries/staff-member-queries/useGetAllStaffMembersQuery";
import { useGetAllQualificationsQuery } from "../../state-management/queries/qualification-queries/useGetAllQualificationsQuery";

const HumanResources = () => {
  const getAllQualificationsQuery = useGetAllQualificationsQuery();
  const getAllStaffMembersQuery = useGetAllStaffMembersQuery();

  const qualifications = getAllQualificationsQuery?.data;
  const staffMembers = getAllStaffMembersQuery?.data;

  if (
    getAllQualificationsQuery.isLoading ||
    getAllStaffMembersQuery.isLoading ||
    qualifications === undefined ||
    staffMembers === undefined
  ) {
    return <LoadingScreen />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <StaffMembers staffMembersFromDatabase={staffMembers} qualificationsFromDatabase={qualifications} />
      </Box>
      <Box sx={{ mb: 4 }}>
        <Qualifications qualificationsFromDatabase={qualifications} />
      </Box>
    </Box>
  );
};

export default HumanResources;
