import { Form, Formik } from "formik";

import { vesselTypeCreationValidation } from "../../../../../validation/VesselTypeValidationSchemas/vesselTypeCreationValidation";
import VesselTypeCreationFormContent from "../VesselTypeCreationFormContent/VesselTypeCreationFormContent";
import type { VesselType } from "../../../../../../domain/Types/entities/VesselType";

interface Props {
  onSubmit: (vesselType: VesselType) => void;
}

export default function VesselTypeCreationForm({ onSubmit }: Props) {
  const initialValues: VesselType = {
    code: "",
    name: "",
    description: "",
    capacity: 0,
    maxRows: 0,
    maxBays: 0,
    maxTiers: 0,
    length: 0,
    draft: 0,
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={vesselTypeCreationValidation}
      onSubmit={(values: VesselType) => onSubmit(values)}
    >
      <Form>
        <VesselTypeCreationFormContent />
      </Form>
    </Formik>
  );
}
