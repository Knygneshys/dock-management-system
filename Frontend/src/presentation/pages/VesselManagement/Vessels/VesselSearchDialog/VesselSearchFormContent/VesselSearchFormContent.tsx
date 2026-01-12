import { Grid } from "@mui/material";

import FormFilterOperatorDropdown from "../../../../../shared/FormComponents/FormFilterOperatorDropdown/FormFilterOperatorDropdown";
import FormInputField from "../../../../../shared/FormComponents/FormInputField/FormInputField";
import FormSubmitButton from "../../../../../shared/FormComponents/FormSubmitButton/FormSubmitButton";
import CompanyDropdown from "../../VesselCreationDialog/CompanyDropdown/CompanyDropdown";
import type { Company } from "../../../../../../domain/Types/entities/Company";

interface Props {
  companies: Company[];
}

export default function VesselSearchFormContent({ companies }: Props) {
  return (
    <Grid marginTop={"1em"} container spacing={2} justifyContent={"center"}>
      <FormInputField label={"Imo"} name={"imo"} />
      <FormInputField label={"Name"} name={"name"} />
      <CompanyDropdown
        companies={companies}
        label={"Operator"}
        name={"operatorCode"}
      />
      <FormFilterOperatorDropdown
        label={"Filter Operator"}
        name={"filterOperator"}
      />
      <FormSubmitButton label={"Update"} />
    </Grid>
  );
}
