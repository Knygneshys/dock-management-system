import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useState } from "react";
import MissingPlansTable from "./MissingPlansTable/MissingPlansTable";
import type { VVN } from "../../../domain/Types/entities/VVN";
import { useGetApprovedVVNsQuery } from "../../state-management/queries/vvn-queries/useGetApprovedVVNsQuery";
import RegenerateDialog from "./RegenerateDialog/RegenerateDialog";

export default function MissingPlansPage() {
  const [selectedVVN, setSelectedVVN] = useState<VVN | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: vvns, isLoading, error } = useGetApprovedVVNsQuery();

  const handleRegenerateClick = (vvn: VVN) => {
    setSelectedVVN(vvn);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedVVN(null);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography color="error">Failed to load VVNs without operation plans</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        Missing Plans
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Vessel Visit Notifications without operation plans. Click the regenerate button to create plans for a specific
        day.
      </Typography>

      {vvns && vvns.length > 0 ? (
        <MissingPlansTable vvns={vvns} onRegenerateClick={handleRegenerateClick} />
      ) : (
        <Typography>No VVNs without operation plans found.</Typography>
      )}

      {selectedVVN && <RegenerateDialog isOpen={isDialogOpen} vvn={selectedVVN} onClose={handleDialogClose} />}
    </Box>
  );
}
