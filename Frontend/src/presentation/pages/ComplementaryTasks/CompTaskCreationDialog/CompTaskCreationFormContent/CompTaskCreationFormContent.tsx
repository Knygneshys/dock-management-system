import { Checkbox, FormControlLabel, Grid, MenuItem, TextField, Typography, CircularProgress } from "@mui/material";
import { useField } from "formik";
import { useGetAllVVEsQuery } from "../../../../state-management/queries/vve-queries/useGetAllVVEsQuery";
import FormInputField from "../../../../shared/FormComponents/FormInputField/FormInputField";
import FormSubmitButton from "../../../../shared/FormComponents/FormSubmitButton/FormSubmitButton";
import { useSearchCompTaskCategoriesQuery } from "../../../../state-management/queries/comp-task-category-queries/useSearchCompTaskCategoriesQuery";

export default function ComplementaryTaskCreationFormContent() {
  const [categoryCodeField, , categoryCodeHelpers] = useField("categoryCode");
  const [vveCodeField, , vveCodeHelpers] = useField("vveCode");
  const [startField, , startHelpers] = useField("start");
  const [impactField, , impactHelpers] = useField("impactOnOperations");

  const categoriesQuery = useSearchCompTaskCategoriesQuery({});
  const vvesQuery = useGetAllVVEsQuery();

  const categories = categoriesQuery.data || [];
  const vves = vvesQuery.data || [];

  const isLoadingCategories = categoriesQuery.isLoading;
  const isLoadingVVEs = vvesQuery.isLoading;

  return (
    <Grid marginTop={"1em"} container spacing={2} justifyContent={"center"}>
      <Grid>
        <TextField
          {...categoryCodeField}
          select
          label="Category *"
          fullWidth
          required
          onChange={(e) => categoryCodeHelpers.setValue(e.target.value)}
          disabled={isLoadingCategories}
          InputLabelProps={{ shrink: true }}
        >
          {isLoadingCategories ? (
            <MenuItem disabled>
              <CircularProgress size={20} /> Loading...
            </MenuItem>
          ) : categories.length === 0 ? (
            <MenuItem disabled>No categories available</MenuItem>
          ) : (
            categories.map((category) => (
              <MenuItem key={category.code} value={category.code}>
                {category.code} - {category.name}
              </MenuItem>
            ))
          )}
        </TextField>
      </Grid>

      <Grid>
        <TextField
          {...vveCodeField}
          select
          label="VVE *"
          fullWidth
          required
          onChange={(e) => vveCodeHelpers.setValue(e.target.value)}
          disabled={isLoadingVVEs}
          InputLabelProps={{ shrink: true }}
        >
          {isLoadingVVEs ? (
            <MenuItem disabled>
              <CircularProgress size={20} /> Loading...
            </MenuItem>
          ) : vves.length === 0 ? (
            <MenuItem disabled>No VVEs available</MenuItem>
          ) : (
            vves.map((vve) => (
              <MenuItem key={vve.vvnCode} value={vve.vvnCode}>
                VVN {vve.vvnCode} - {vve.vesselImo}
              </MenuItem>
            ))
          )}
        </TextField>
      </Grid>

      <Grid>
        <FormInputField required label={"Team"} name={"team"} />
      </Grid>

      <Grid>
        <TextField
          {...startField}
          type="datetime-local"
          label="Start Date & Time *"
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
          onChange={(e) => startHelpers.setValue(e.target.value)}
        />
      </Grid>

      <Grid>
        <FormControlLabel
          control={<Checkbox checked={impactField.value} onChange={(e) => impactHelpers.setValue(e.target.checked)} />}
          label="Impact on Operations"
        />
      </Grid>

      <Grid>
        <Typography variant="caption" color="textSecondary">
          * Status will be set to "Scheduled" by default
        </Typography>
      </Grid>

      <Grid>
        <FormSubmitButton label={"Create"} />
      </Grid>
    </Grid>
  );
}
