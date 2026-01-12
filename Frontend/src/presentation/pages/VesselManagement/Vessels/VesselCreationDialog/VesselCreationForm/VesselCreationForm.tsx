import { Form, Formik } from "formik";

import { vesselCreationValidation } from "../../../../../validation/VesselValidationSchemas/vesselCreationValidation";
import VesselCreationFormContent from "../VesselCreationFormContent/VesselCreationFormContent";
import type { VesselType } from "../../../../../../domain/Types/entities/VesselType";
import type { Company } from "../../../../../../domain/Types/entities/Company";
import type { CreateVesselCommand } from "../../../../../../application/vessel/commands/CreateVesselCommand";

interface Props {
  vesselTypes: VesselType[];
  onSubmit: (vessel: CreateVesselCommand) => void;
  companies: Company[];
}

export default function VesselCreationForm({
  vesselTypes,
  onSubmit,
  companies,
}: Props) {
  const initialValues: CreateVesselCommand = {
    imo: "",
    name: "",
    typeCode: "",
    operatorCode: "",
    ownerCode: "",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={vesselCreationValidation}
      onSubmit={(values: CreateVesselCommand) => onSubmit(values)}
    >
      <Form>
        <VesselCreationFormContent
          vesselTypes={vesselTypes}
          companies={companies}
        />
      </Form>
    </Formik>
  );
}
