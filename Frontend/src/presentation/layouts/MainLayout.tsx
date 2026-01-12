import "../styles/layout.css";

import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import { useUserContext } from "../context/userContext";
import PrivacyPolicyConfirmationDialog from "../components/PrivacyPolicy/PrivacyPolicyConfirmationDialog";
import { useState } from "react";
import { useUserApprovePrivacyPolicy } from "../state-management/mutations/user-mutations/useUserApprovePrivacyPolicy";

export default function MainLayout() {
  const user = useUserContext();

  const [
    isPrivacyPolicyConfirmationDialogOpen,
    setIsPrivacyPolicyConfirmationDialogOpen,
  ] = useState<boolean>(!user.hasReadPrivacyPolicy);

  const userApprovePrivacyPolicy = useUserApprovePrivacyPolicy();
  const handlePrivacyPolicyApprovalDialogClose = () => {
    setIsPrivacyPolicyConfirmationDialogOpen(false);
  };

  const handlePrivacyPolicyApproval = async () => {
    userApprovePrivacyPolicy.mutate(user.email!);
    handlePrivacyPolicyApprovalDialogClose();
  };
  return (
    <>
      {isPrivacyPolicyConfirmationDialogOpen && (
        <PrivacyPolicyConfirmationDialog
          isOpen={isPrivacyPolicyConfirmationDialogOpen}
          handleApprove={handlePrivacyPolicyApproval}
        />
      )}
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar />

        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Header />

          <Box sx={{ flexGrow: 1, p: 3, bgcolor: "#f9fafb" }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </>
  );
}
