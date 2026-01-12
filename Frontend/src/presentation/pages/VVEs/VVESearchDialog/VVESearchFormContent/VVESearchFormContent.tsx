import { Button, Grid, MenuItem, TextField } from "@mui/material";
import { useField } from "formik";
import FormInputField from "../../../../shared/FormComponents/FormInputField/FormInputField";
import FormSubmitButton from "../../../../shared/FormComponents/FormSubmitButton/FormSubmitButton";


interface Props {
  onClear: () => void;
}

export default function VVESearchFormContent({ onClear }: Props) {
  const [startDateField, , startDateHelpers] = useField("startDate");
  const [startHourField, , startHourHelpers] = useField("startHour");
  const [startMinuteField, , startMinuteHelpers] = useField("startMinute");
  const [statusField, , statusHelpers] = useField("status");

  return (
    <Grid marginTop={"1em"} container spacing={2} justifyContent={"center"}>
      <Grid>
        <TextField
          {...startDateField}
          type="date"
          label="Start Date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          onChange={(e) => startDateHelpers.setValue(e.target.value)}
        />
      </Grid>

      <Grid>
        <TextField
          fullWidth
          type="number"
          name="startHour"
          label="Start Hour (0-23)"
          value={startHourField.value}
          onChange={(e) => startHourHelpers.setValue(e.target.value)}
          inputProps={{ min: 0, max: 23 }}
        />
      </Grid>

      <Grid>
        <TextField
          fullWidth
          type="number"
          name="startMinute"
          label="Start Minute (0-59)"
          value={startMinuteField.value}
          onChange={(e) => startMinuteHelpers.setValue(e.target.value)}
          inputProps={{ min: 0, max: 59 }}
        />
      </Grid>

      <Grid>
        <FormInputField label={"Vessel IMO"} name={"vesselImo"} />
      </Grid>

      <Grid>
        <TextField
          {...statusField}
          select
          label="Status"
          fullWidth
          onChange={(e) => statusHelpers.setValue(e.target.value)}
          InputLabelProps={{ shrink: true }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="InProgress">In Progress</MenuItem>
          <MenuItem value="Concluded">Concluded</MenuItem>
        </TextField>
      </Grid>

      <Grid>
        <Button fullWidth variant="outlined" onClick={onClear}>
          Clear
        </Button>
      </Grid>

      <Grid>
        <FormSubmitButton label={"Search"} />
      </Grid>
    </Grid>
  );
}