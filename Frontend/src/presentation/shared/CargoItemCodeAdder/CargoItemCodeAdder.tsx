/* eslint-disable no-magic-numbers */
import { Add, Delete } from "@mui/icons-material";
import { Box, Button, Chip, Grid, Paper, Typography } from "@mui/material";
import { useState } from "react";

import FormInputField from "../FormComponents/FormInputField/FormInputField";
import { accentColor } from "../../constants/colorscheme";

interface Props {
  onCodesChange: (codes: string[]) => void;
}

function CargoItemCodeAdder({ onCodesChange }: Props) {
  const [cargoItemCodes, setCargoItemCodes] = useState<string[]>([]);
  const [currentCode, setCurrentCode] = useState("");

  const handleAddCode = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (currentCode.trim() && !cargoItemCodes.includes(currentCode.trim())) {
      const newCodes: string[] = [...cargoItemCodes, currentCode.trim()];
      setCargoItemCodes(newCodes);
      onCodesChange(newCodes);
      setCurrentCode("");
    }
  };

  const handleRemoveCode = (codeToRemove: string) => {
    const newCodes = cargoItemCodes.filter((code) => code !== codeToRemove);
    setCargoItemCodes(newCodes);
    onCodesChange(newCodes);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCode(e);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Cargo Item Codes
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="flex-end">
          {/* @ts-ignore */}
          <Grid size={12}>
            <FormInputField
              name="cargoItemCode"
              label="Cargo Item Code"
              // @ts-ignore
              value={currentCode}
              // @ts-ignore
              onChange={(e) => setCurrentCode(e.target.value)}
              // @ts-ignore
              onKeyPress={handleKeyPress}
              placeholder="Cargo Item Code"
            />
          </Grid>

          {/* @ts-ignore */}
          <Grid size={12}>
            {/* @ts-ignore */}
            <Button
              onClick={handleAddCode}
              disabled={!currentCode.trim()}
              startIcon={<Add />}
              fullWidth
              variant="contained"
              sx={{ backgroundColor: accentColor }}
            >
              Add Code
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {cargoItemCodes.length > 0 && (
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Added Codes ({cargoItemCodes.length})
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {cargoItemCodes.map((code, index) => (
              <Chip
                key={index}
                label={code}
                onDelete={() => handleRemoveCode(code)}
                deleteIcon={<Delete />}
                variant="outlined"
                color="primary"
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default CargoItemCodeAdder;
