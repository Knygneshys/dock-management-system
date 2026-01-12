import { Grid, Typography } from "@mui/material";
import FormInputField from "../../../../../shared/FormComponents/FormInputField/FormInputField";
import FormSubmitButton from "../../../../../shared/FormComponents/FormSubmitButton/FormSubmitButton";
import { FormikDateTimePicker } from "../../../../../shared/FormikDateTimePicker/FormikDateTimePicker";
import ContainerDropdown from "../ContainerDropdown/ContainerDropdown";
import { PlannedOperation } from "../../../../../../domain/Types/entities/PlannedOperation";

interface Props {
  containers: string[];
}

export default function ExecutedOperationCreationFormContent({
  containers,
}: Props) {
  return (
    <Grid marginTop={"1em"} container spacing={2} justifyContent={"center"}>
      <FormikDateTimePicker name="start" label="Start" />
      <FormikDateTimePicker name="end" label="End" />
      <Typography>From</Typography>
      <FormInputField
        required
        type={"number"}
        label={"Tier"}
        name={"fromTier"}
      />
      <FormInputField required type={"number"} label={"Bay"} name={"fromBay"} />
      <FormInputField required type={"number"} label={"Row"} name={"fromRow"} />
      <Typography>To</Typography>
      <FormInputField required type={"number"} label={"Tier"} name={"toTier"} />
      <FormInputField required type={"number"} label={"Bay"} name={"toBay"} />
      <FormInputField required type={"number"} label={"Row"} name={"toRow"} />
      <ContainerDropdown
        label={"Container Id"}
        name={"containerId"}
        containers={containers}
      />
      <FormSubmitButton label={"Create"} />
    </Grid>
  );
}
