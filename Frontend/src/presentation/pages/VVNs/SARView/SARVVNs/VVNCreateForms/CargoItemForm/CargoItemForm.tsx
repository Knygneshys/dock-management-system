import { Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import FormInputField from "../../../../../../shared/FormComponents/FormInputField/FormInputField";
import type { CargoItem } from "../../../../../../../domain/Types/entities/CargoItem";
import { accentColor } from "../../../../../../constants/colorscheme";

interface Props {
  cargoItems: CargoItem[];
  onAddItem: (item: CargoItem, setFieldValue: any) => void;
  onRemoveItem: (index: number) => void;
  formValues: any;
  setFieldValue: any;
}

function CargoItemSection({
  cargoItems,
  onAddItem,
  onRemoveItem,
  formValues,
  setFieldValue,
}: Props) {
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    onAddItem(formValues, setFieldValue);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Cargo Items
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={12}>
            <FormInputField name="containerISO" label="Container ISO" />
          </Grid>

          <Grid size={12}>
            <FormInputField name="description" label="Description" />
          </Grid>

          <Grid size={12}>
            <FormInputField name="from" label="From" />
          </Grid>

          <Grid size={12}>
            <FormInputField name="to" label="To" />
          </Grid>

          <Grid size={4}>
            <FormInputField type="number" name="bay" label="Bay" />
          </Grid>

          <Grid size={4}>
            <FormInputField type="number" name="row" label="Row" />
          </Grid>

          <Grid size={4}>
            <FormInputField type="number" name="tier" label="Tier" />
          </Grid>

          <Grid size={12}>
            <Button
              onClick={handleAddItem}
              variant="contained"
              fullWidth
              sx={{ backgroundColor: accentColor }}
            >
              Add Cargo Item
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {cargoItems.length > 0 && (
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Added Items ({cargoItems.length})
          </Typography>
          {cargoItems.map((item: CargoItem, index: number) => (
            <Paper
              key={index}
              sx={{
                p: 2,
                mb: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="body2">
                  <strong>Container:</strong> {item.containerISO} |
                  <strong> Desc:</strong> {item.description} |
                  <strong> From:</strong> {item.from} → <strong>To:</strong>{" "}
                  {item.to} |<strong> Position:</strong> Bay{" "}
                  {item.vesselContainerPosition.bay}, Row{" "}
                  {item.vesselContainerPosition.row}, Tier{" "}
                  {item.vesselContainerPosition.tier}
                </Typography>
              </Box>
              <IconButton
                size="small"
                color="error"
                onClick={() => onRemoveItem(index)}
              >
                <Delete />
              </IconButton>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default CargoItemSection;
