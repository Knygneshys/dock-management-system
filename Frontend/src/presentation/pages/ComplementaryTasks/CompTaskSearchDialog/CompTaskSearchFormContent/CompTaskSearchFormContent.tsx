import { Button, Grid, MenuItem, TextField } from "@mui/material";
import { useField } from "formik";
import FormSubmitButton from "../../../../shared/FormComponents/FormSubmitButton/FormSubmitButton";

interface Props {
  onClear: () => void;
}

export default function CompTaskSearchFormContent({ onClear }: Props) {
  const [startField, , startHelpers] = useField("start");
  const [endField, , endHelpers] = useField("end");
  const [statusField, , statusHelpers] = useField("status");

  return (
    <Grid marginTop={"1em"} container spacing={2} justifyContent={"center"}>
      <Grid>
        <TextField
          {...startField}
          type="datetime-local"
          label="Start Date & Time"
          fullWidth
          InputLabelProps={{ shrink: true }}
          onChange={(e) => startHelpers.setValue(e.target.value)}
        />
      </Grid>

      <Grid>
        <TextField
          {...endField}
          type="datetime-local"
          label="End Date & Time"
          fullWidth
          InputLabelProps={{ shrink: true }}
          onChange={(e) => endHelpers.setValue(e.target.value)}
        />
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
          <MenuItem value="ongoing">Ongoing</MenuItem>
          <MenuItem value="scheduled">Scheduled</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
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