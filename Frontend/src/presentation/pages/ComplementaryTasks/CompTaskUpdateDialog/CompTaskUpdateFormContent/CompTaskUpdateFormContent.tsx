import { Grid, MenuItem, TextField, Button } from "@mui/material";
import { useFormikContext } from "formik";
import { accentColor } from "../../../../constants/colorscheme";

export default function ComplementaryTaskUpdateFormContent() {
  const { values, setFieldValue, submitForm } = useFormikContext<any>();

  return (
    <Grid marginTop={"1em"} container spacing={2} justifyContent={"center"}>
      <Grid>
        <TextField
          label="Team"
          name="team"
          fullWidth
          value={values.team}
          onChange={(e) => setFieldValue("team", e.target.value)}
        />
      </Grid>

      <Grid>
        <TextField
          select
          label="Status"
          fullWidth
          value={values.status}
          onChange={(e) => setFieldValue("status", e.target.value)}
          InputLabelProps={{ shrink: true }}
        >
          <MenuItem value="ongoing">Ongoing</MenuItem>
          <MenuItem value="scheduled">Scheduled</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </TextField>
      </Grid>

      <Grid>
        <TextField
          type="datetime-local"
          label="End Date & Time"
          fullWidth
          value={values.end}
          onChange={(e) => setFieldValue("end", e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>

      <Grid>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={submitForm}
          sx={{backgroundColor: accentColor}}
         >
          Update
        </Button>
      </Grid>
    </Grid>
  );
}