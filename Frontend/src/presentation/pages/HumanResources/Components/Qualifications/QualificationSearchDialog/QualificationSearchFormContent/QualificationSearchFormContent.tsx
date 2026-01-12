import { Button, Grid, MenuItem, TextField } from "@mui/material";
import { useField } from "formik";

import FormInputField
  from "../../../../../../shared/FormComponents/FormInputField/FormInputField";
import FormSubmitButton
  from
  "../../../../../../shared/FormComponents/FormSubmitButton/FormSubmitButton";

interface Props {
  onClear: () => void,
}

export default function QualificationSearchFormContent({ onClear } : Props) {
  const [operatorField] = useField("operatorType");

  return (
    <Grid
      marginTop={"1em"}
      container
      spacing={2}
      justifyContent={"center"}
    >
      <Grid>
        <FormInputField
          label={"Name"}
          name={"name"}
        />
      </Grid>
      <Grid>
        <FormInputField
          label={"Code"}
          name={"code"}
        />
      </Grid>
      <Grid >
        <TextField
          {...operatorField}
          select
          label="Operator Type"
          fullWidth
        >
          <MenuItem value="contains">Contains</MenuItem>
          <MenuItem value="equals">Equals</MenuItem>
        </TextField>
      </Grid>
      <Grid >
        <Button
          fullWidth
          variant="outlined"
          onClick={onClear}
        >
          Clear
        </Button>
      </Grid>
      <Grid >
        <FormSubmitButton label={"Search"} />
      </Grid>
    </Grid>
  );
}