import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { accentColor } from "../../../constants/colorscheme";
import { usePublishPrivacyPolicyMutation } from "../../../state-management/mutations/privacy-policy-mutations/usePublishPrivacyPolicyMutation";
import { useGetNewestPrivacyPolicyQuery } from "../../../state-management/queries/privacy-policy-queries/useGetNewestPrivacyPolicyQuery";
import { useGetAllPrivacyPoliciesQuery } from "../../../state-management/queries/privacy-policy-queries/useGetAllPrivacyPoliciesQuery";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";
import PrivacyPolicyTable from "./PrivacyPolicyTable/PrivacyPolicyTable";
import { PrivacyPolicy } from "../../../../domain/Types/entities/PrivacyPolicy";
import PrivacyPolicyViewingDialog from "./PrivacyPolicyViewingDialog/PrivacyPolicyViewingDialog";

export default function PrivacyPolicyAdministration() {
  const [markdown, setMarkdown] = useState<string>("");
  const [isPrivacyPolicyDialogOpen, setIsPrivacyPolicyDialogOpen] =
    useState<boolean>(false);
  const [selectedPrivacyPolicy, setSelectedPrivacyPolicy] =
    useState<PrivacyPolicy | null>(null);

  const publishPrivacyPolicyMutation = usePublishPrivacyPolicyMutation();
  const getAllPrivacyPoliciesQuery = useGetAllPrivacyPoliciesQuery();

  if (getAllPrivacyPoliciesQuery.isLoading) {
    return <LoadingScreen />;
  }

  const privacyPolicies = getAllPrivacyPoliciesQuery.data;

  if (getAllPrivacyPoliciesQuery.isError || privacyPolicies === undefined) {
    return <Typography>Failed to fetch privacy policies!</Typography>;
  }

  const initialMarkdown =
    privacyPolicies[0] === undefined ? "" : privacyPolicies[0].content;

  const handleChange = (value: string) => {
    setMarkdown(value);
  };

  const handlePublish = () => {
    publishPrivacyPolicyMutation.mutate({ content: markdown });
  };

  const handleViewPrivacyPolicyContent = (version: number) => {
    const privacyPolicy = privacyPolicies?.find((pp) => pp.version === version);
    if (privacyPolicy) {
      setSelectedPrivacyPolicy(privacyPolicy);
      setIsPrivacyPolicyDialogOpen(true);
    }
  };

  const handlePrivacyPolicyDialogClose = () => {
    setIsPrivacyPolicyDialogOpen(false);
  };

  return (
    <Box>
      <SimpleMDE value={initialMarkdown} onChange={handleChange} />
      <Button
        onClick={handlePublish}
        sx={{
          color: "black",
          backgroundColor: accentColor,
        }}
      >
        Publish
      </Button>
      <PrivacyPolicyTable
        privacyPolicies={privacyPolicies}
        handleViewPrivacyPolicyContent={handleViewPrivacyPolicyContent}
      />
      {isPrivacyPolicyDialogOpen && selectedPrivacyPolicy && (
        <PrivacyPolicyViewingDialog
          privacyPolicy={selectedPrivacyPolicy}
          isOpen={isPrivacyPolicyDialogOpen}
          handleClose={handlePrivacyPolicyDialogClose}
        />
      )}
    </Box>
  );
}
