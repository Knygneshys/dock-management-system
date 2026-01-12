import { Form, Formik } from "formik";

import { vesselTypeSearchValidation }
  from "../../../../../validation/VesselTypeValidationSchemas/vesselTypeSearchValidation";
import VesselTypeSearchDialogFormContent
  from "../VesselTypeSearchDialogFormContent/VesselTypeSearchDialogFormContent";
import type { VesselTypeSearchQuery } from "../../../../../../application/vessel-type/queries/VesselTypeSearchQuery";

interface Props {
  onSubmit: (searchQuery: VesselTypeSearchQuery) => void;
}

export default function VesselTypeSearchDialogForm({ onSubmit } : Props) {
  const initialValues = {
    name: '',
    description: '',
    filterOperator: 0,
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => onSubmit(values)}
      validationSchema={vesselTypeSearchValidation}
    >
      <Form>
        <VesselTypeSearchDialogFormContent />
      </Form>
    </Formik>
  );
}