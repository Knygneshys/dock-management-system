import { Grid } from "@mui/material";

import FormInputField from "../../../../../shared/FormComponents/FormInputField/FormInputField";
import FormSubmitButton from "../../../../../shared/FormComponents/FormSubmitButton/FormSubmitButton";
import CompanyDropdown from "../CompanyDropdown/CompanyDropdown";
import VesselTypeDropdown from "../VesselTypeDropdown/VesselTypeDropdown";
import type { VesselType } from "../../../../../../domain/Types/entities/VesselType";
import type { Company } from "../../../../../../domain/Types/entities/Company";

interface Props {
  vesselTypes: VesselType[];
  companies: Company[];
}

export default function VesselCreationFormContent({
  vesselTypes,
  companies,
}: Props) {
  return (
    <Grid marginTop={"1em"} container spacing={2} justifyContent={"center"}>
      <FormInputField required label={"Imo"} name={"imo"} />
      <FormInputField required label={"Name"} name={"name"} />
      <VesselTypeDropdown
        vesselTypes={vesselTypes}
        required
        label={"Type"}
        name={"typeCode"}
      />
      <CompanyDropdown
        companies={companies}
        required
        label={"Owner"}
        name={"ownerCode"}
      />
      <CompanyDropdown
        companies={companies}
        required
        label={"Operator"}
        name={"operatorCode"}
      />
      <FormSubmitButton label={"Create"} />
    </Grid>
  );
}
