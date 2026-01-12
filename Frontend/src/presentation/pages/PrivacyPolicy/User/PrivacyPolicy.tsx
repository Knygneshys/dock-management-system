import Markdown from "react-markdown";
import { useGetNewestPrivacyPolicyQuery } from "../../../state-management/queries/privacy-policy-queries/useGetNewestPrivacyPolicyQuery";
import { Box, Typography } from "@mui/material";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";

export default function PrivacyPolicy() {
  const getNewestPrivacyPolicyQuery = useGetNewestPrivacyPolicyQuery();

  if (getNewestPrivacyPolicyQuery.isError) {
    <Typography>Failed to fetch privacy policy!</Typography>;
  }

  if (getNewestPrivacyPolicyQuery.isLoading) {
    return <LoadingScreen />;
  }

  const privacyPolicy = getNewestPrivacyPolicyQuery.data;

  return (
    <Box>
      {privacyPolicy ? (
        <Markdown>{privacyPolicy.content}</Markdown>
      ) : (
        <Typography>There is no privacy policy!</Typography>
      )}
    </Box>
  );
}
