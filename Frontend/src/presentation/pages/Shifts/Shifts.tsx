import React from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Box, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import ShiftsCreationDialog from "./ShiftsCreationDialog/ShiftsCreationDialog";
import ShiftsTable from "./ShiftsTable/ShiftsTable";
import type { Shift } from "../../../domain/Types/entities/Shift";
import { useGetAllShiftsQuery } from "../../state-management/queries/shift-queries/useGetAllShiftsQuery";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";

const MINIMUM_ARRAY_LENGTH = 0;

export interface Props {
  shiftsFromDatabase?: Shift[];
}

const Shifts: React.FC<Props> = ({ shiftsFromDatabase }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const getAllShiftsQuery = useGetAllShiftsQuery();
  const shifts = shiftsFromDatabase ?? getAllShiftsQuery?.data;

  if (
    !shiftsFromDatabase &&
    (getAllShiftsQuery.isLoading || shifts === undefined)
  ) {
    return <LoadingScreen />;
  }

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography fontWeight={"bold"} sx={{ width: "25%" }}>
          Shifts
        </Typography>
        <Box sx={{ width: "75%", textAlign: "right" }}>
          <IconButton
            onClick={handleOpen}
            color="primary"
            data-testid="shift-creation-dialog-button"
          >
            <AddCircleOutlineIcon />
          </IconButton>
        </Box>
      </Box>
      {shifts && shifts.length > MINIMUM_ARRAY_LENGTH ? (
        <ShiftsTable shifts={shifts} />
      ) : (
        <Typography>No Shifts found!</Typography>
      )}
      <ShiftsCreationDialog open={open} onClose={handleClose} />
    </Box>
  );
};

export default Shifts;
