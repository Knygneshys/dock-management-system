import { Grid } from "@mui/material";
import FormInputField from "../../../../../shared/FormComponents/FormInputField/FormInputField";
import FormSubmitButton from "../../../../../shared/FormComponents/FormSubmitButton/FormSubmitButton";
import AlgorithmSelectionDropdown from "../../../../../shared/FormComponents/AlgorithmSelectionDropdown/AlgorithmSelectionDropdown";
import FormMultiselectField from "../../../../../shared/FormComponents/FormMultiselectField/FormMultiselectField";
import { FormikDateTimePicker } from "../../../../../shared/FormikDateTimePicker/FormikDateTimePicker";

interface Props {
  staffIdArray: number[];
  resourceIdArray: string[];
}

export default function OperationPlanUpdateFormContent({
  staffIdArray,
  resourceIdArray,
}: Props) {
  return (
    <Grid marginTop={"1em"} container spacing={2} justifyContent={"center"}>
      <FormInputField required label={"Dock Code"} name={"dockCode"} />
      <FormMultiselectField
        name="craneCodes"
        label="Cranes"
        options={resourceIdArray}
      />
      <FormMultiselectField
        name="staffCodes"
        label="Staff IDs"
        options={staffIdArray}
      />
      <FormInputField
        required
        label={"Storage Area Code"}
        name={"storageAreaCode"}
      />
      <FormikDateTimePicker name="start" label="Start" />
      <FormikDateTimePicker name="end" label="End" />
      <FormInputField
        required
        label={"Creator Email"}
        name={"creatorUserEmail"}
      />
      <AlgorithmSelectionDropdown
        label={"Used Algorithm"}
        name={"usedAlgorithm"}
      />
      <FormSubmitButton label={"Update"} />
    </Grid>
  );
}
