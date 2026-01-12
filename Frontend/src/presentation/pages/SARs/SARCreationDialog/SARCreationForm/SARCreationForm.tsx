import { Form, Formik } from "formik";

import { sarCreationValidation } from "../../../../validation/SarValidationSchemas/sarValidation";
import SarCreationFormContent from "../SARCreationFormContent/SARCreationFormContent";
import type { ShippingAgentRepresentative } from "../../../../../domain/Types/entities/ShippingAgentRepresentative";

interface Props {
  onSubmit: (sar: ShippingAgentRepresentative) => void;
}

export default function SarCreationForm({ onSubmit }: Props) {
  const initialValues = {
    name: "",
    email: "",
    companyCode: "",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={sarCreationValidation}
      onSubmit={(values) => onSubmit(values)}
    >
      <Form>
        <SarCreationFormContent />
      </Form>
    </Formik>
  );
}
