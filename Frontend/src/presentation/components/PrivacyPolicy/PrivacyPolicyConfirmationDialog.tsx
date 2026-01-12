import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { accentColor } from "../../constants/colorscheme";
import { useGetNewestPrivacyPolicyQuery } from "../../state-management/queries/privacy-policy-queries/useGetNewestPrivacyPolicyQuery";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import Markdown from "react-markdown";

interface Props {
  isOpen: boolean;
  handleApprove: () => void;
}

export default function PrivacyPolicyConfirmationDialog({
  isOpen,
  handleApprove,
}: Props) {
  const getNewestPrivacyPolicyQuery = useGetNewestPrivacyPolicyQuery();

  if (getNewestPrivacyPolicyQuery.isError) {
    <Typography>Failed to fetch privacy policy!</Typography>;
  }

  if (getNewestPrivacyPolicyQuery.isLoading) {
    return <LoadingScreen />;
  }

  const privacyPolicy = getNewestPrivacyPolicyQuery.data;
  const dialogTitle = "The Privacy Policy has been updated!";

  return (
    <Dialog open={isOpen}>
      <DialogTitle sx={{ textAlign: "center" }}>{dialogTitle}</DialogTitle>
      <DialogContent>
        {privacyPolicy ? (
          <Markdown>{privacyPolicy.content}</Markdown>
        ) : (
          <Typography>There is no privacy policy!</Typography>
        )}
        <Box sx={{ textAlign: "center" }}>
          <Button sx={{ backgroundColor: accentColor }} onClick={handleApprove}>
            Approve
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
