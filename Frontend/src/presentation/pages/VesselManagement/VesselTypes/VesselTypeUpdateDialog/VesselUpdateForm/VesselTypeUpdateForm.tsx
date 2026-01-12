import { Form, Formik } from "formik";

import { vesselTypeUpdateValidation } from "../../../../../validation/VesselTypeValidationSchemas/vesselTypeUpdateValidation";
import VesselTypeUpdateFormContent from "../VesselTypeUpdateFormContent/VesselTypeUpdateFormContent";
import type { VesselType } from "../../../../../../domain/Types/entities/VesselType";

interface Props {
  vesselType: VesselType;
  onSubmit: (vesselTypeUpdate: VesselType) => void;
}

interface FormValues {
  name: string;
  description: string;
  capacity: number;
  maxRows: number;
  maxBays: number;
  maxTiers: number;
  length: number;
  draft: number;
}

export default function VesselTypeUpdateForm({ vesselType, onSubmit }: Props) {
  const initialValues: FormValues = {
    name: vesselType.name,
    description: vesselType.description,
    capacity: vesselType.capacity,
    maxRows: vesselType.maxRows,
    maxBays: vesselType.maxBays,
    maxTiers: vesselType.maxTiers,
    length: vesselType.length,
    draft: vesselType.draft,
  };

  const handleSubmit = (values: FormValues) => {
    const updatedVesselType: VesselType = {
      code: vesselType.code,
      ...values,
    };

    onSubmit(updatedVesselType);
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={vesselTypeUpdateValidation}
    >
      <Form>
        <VesselTypeUpdateFormContent />
      </Form>
    </Formik>
  );
}
