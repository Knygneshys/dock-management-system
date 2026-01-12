import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from "@mui/material";
import { OperationPlanSearchQuery } from "../../../../application/operation-plan/queries/OperationPlanSearchQuery";
import { accentColor } from "../../../constants/colorscheme";
import { operationPlanSearchSortBy } from "../../../../domain/Enums/operationPlanSearchSortBy";
import { searchSortDir } from "../../../../domain/Enums/searchSortDir";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  onChange: (value: any) => void;
  query: OperationPlanSearchQuery;
}

function OperationPlanSearchDialog({ isOpen, handleClose, onChange, query }: Props) {
  const dialogTitle = "Search Operation Plans";

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle sx={{ textAlign: "center" }}>{dialogTitle}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 3 }}>
          <TextField id="opPlanVVNCode" label="VVN Code" type="search" value={query.vvnCode} onChange={onChange} />
          <FormControl variant="standard" sx={{ minWidth: 120 }}>
            <InputLabel id="sortOpPlansBy-label">Sort By</InputLabel>
            <Select
              name="sortOpPlansBy"
              labelId="sortOpPlansBy-label"
              label="Sort By"
              value={query.sortBy}
              onChange={onChange}
            >
              <MenuItem value={undefined}>
                <em>None</em>
              </MenuItem>
              <MenuItem value={operationPlanSearchSortBy.createdAt}>Created At</MenuItem>
              <MenuItem value={operationPlanSearchSortBy.start}>Start</MenuItem>
              <MenuItem value={operationPlanSearchSortBy.end}>End</MenuItem>
              <MenuItem value={operationPlanSearchSortBy.vvnCode}>VVN Code</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="standard" sx={{ minWidth: 120 }}>
            <InputLabel id="sortOpPlansDir-label">Sort By</InputLabel>
            <Select
              name="sortOpPlansDir"
              labelId="sortOpPlansDir-label"
              label="Sort Dir"
              value={query.sortDir}
              onChange={onChange}
            >
              <MenuItem value={undefined}>
                <em>None</em>
              </MenuItem>
              <MenuItem value={searchSortDir.asc}>Ascendent</MenuItem>
              <MenuItem value={searchSortDir.desc}>Descendent</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ backgroundColor: accentColor }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default OperationPlanSearchDialog;
