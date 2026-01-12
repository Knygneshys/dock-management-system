/* eslint-disable no-magic-numbers */
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { useState } from "react";

import VVNFeedBackDialog from "../VVNFeedbackDialog/VVNFeedbackDialog";
import type { VVN } from "../../../../../../domain/Types/entities/VVN";
import { VVN_SUBMISSION_TYPE } from "../../../../../../domain/Enums/vvnSubmissionType";
import { VVN_STATUS } from "../../../../../../domain/Enums/vvnStatus";
import { secondaryColor } from "../../../../../constants/colorscheme";

interface Props {
  vvn: VVN;
  open: boolean;
  onClose: () => void;
}

function VVNDialog({ vvn, open, onClose }: Props) {
  const [submissionType, setSubmissionType] = useState<number | null>(null);
  const [isFeedckDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const START_SLICE = 0;
  const END_SLICE = -3;
  const handleDialogClose = () => {
    setIsFeedbackDialogOpen(false);
  };
  const handleAprove = () => {
    setSubmissionType(VVN_SUBMISSION_TYPE.APROVE);
    setIsFeedbackDialogOpen(true);
    return;
  };
  const handleReject = () => {
    setSubmissionType(VVN_SUBMISSION_TYPE.REJECT);
    setIsFeedbackDialogOpen(true);
    return;
  };
  const handleInProgress = () => {
    setSubmissionType(VVN_SUBMISSION_TYPE.IN_PROGRESS);
    setIsFeedbackDialogOpen(true);
    return;
  };
  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>
          {`Vessel Visit Notification `}
          <Typography
            fontSize="1.25rem"
            component="span"
            sx={{
              fontWeight: "bold",
              color: secondaryColor,
            }}
          >
            {vvn.code}
          </Typography>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <Grid container spacing={2}>
            <Divider sx={{ width: "100%" }} />
            <Grid size={12}>
              <Typography>{`ETA: ${new Date(
                vvn.eta
              ).toDateString()} at ${new Date(vvn.eta)
                .toLocaleTimeString()
                .slice(START_SLICE, END_SLICE)}`}</Typography>
            </Grid>
            <Grid size={12}>
              <Typography>{`ETD: ${new Date(
                vvn.etd
              ).toDateString()} at ${new Date(vvn.etd)
                .toLocaleTimeString()
                .slice(START_SLICE, END_SLICE)}`}</Typography>
            </Grid>
            <Divider sx={{ width: "100%" }} />
            <Grid size={12}>
              <Typography variant="h5">Vessel</Typography>
            </Grid>
            <Grid size={6}>
              <Typography>{`IMO: ${vvn.vessel.imo}`}</Typography>
            </Grid>
            <Grid size={6}>
              <Typography>{`Name: ${vvn.vessel.name}`}</Typography>
            </Grid>
            <Grid size={6}>
              <Typography>{`Owner: ${vvn.vessel.owner.name}`}</Typography>
            </Grid>
            <Grid size={6}>
              <Typography>{`Operator: ${vvn.vessel.operator.name}`}</Typography>
            </Grid>
            <Divider sx={{ width: "100%" }} />
            <Grid size={12}>
              <Typography variant="h5">
                Shipping Agent Representative
              </Typography>
            </Grid>
            <Grid size={6}>
              <Typography>{`Name: ${vvn.shippingAgentRepresentative.name}`}</Typography>
            </Grid>
            <Grid size={6}>
              <Typography>{`Email: ${vvn.shippingAgentRepresentative.email}`}</Typography>
            </Grid>
            <Divider sx={{ width: "100%" }} />
          </Grid>
        </DialogContent>
        <DialogActions>
          {vvn.status === VVN_STATUS.SUBMITTED ? (
            <Button onClick={handleAprove}>Aprove</Button>
          ) : null}
          {vvn.status === VVN_STATUS.SUBMITTED ||
          vvn.status === VVN_STATUS.INPROGRESS ? (
            <Button onClick={handleReject}>Reject</Button>
          ) : null}
          {vvn.status === VVN_STATUS.SUBMITTED ? (
            <Button onClick={handleInProgress}>Send Back</Button>
          ) : null}
        </DialogActions>
      </Dialog>
      <VVNFeedBackDialog
        vvn={vvn}
        open={isFeedckDialogOpen}
        onClose={handleDialogClose}
        submissionType={submissionType}
      />
    </>
  );
}

export default VVNDialog;
