import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import type { Qualification } from "../../../../../../../domain/Types/entities/Qualification";
import { accentColor } from "../../../../../../constants/colorscheme";

interface AddQualificationSelectorProps {
  availableQualifications: Qualification[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  onAdd: () => void;
}

const AddQualificationSelector = ({
  availableQualifications,
  selectedValue,
  onValueChange,
  onAdd,
}: AddQualificationSelectorProps) => {
  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
        Add Qualification
      </Typography>

      <Box sx={{ display: "flex", gap: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Select Qualification</InputLabel>
          <Select
            value={selectedValue}
            onChange={(e) => onValueChange(e.target.value as string)}
            label="Select Qualification"
          >
            {availableQualifications.length > 0 ? (
              availableQualifications.map((qual) => (
                <MenuItem key={qual.code} value={qual.code}>
                  {qual.name} ({qual.code})
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>All qualifications assigned</MenuItem>
            )}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={onAdd}
          disabled={!selectedValue}
          sx={{ background: accentColor, minWidth: "100px" }}
        >
          Add
        </Button>
      </Box>
    </Box>
  );
};

export default AddQualificationSelector;
