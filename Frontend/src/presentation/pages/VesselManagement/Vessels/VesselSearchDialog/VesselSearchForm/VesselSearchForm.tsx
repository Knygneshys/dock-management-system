import { Form, Formik } from "formik";

import { vesselSearchValidation } from "../../../../../validation/VesselValidationSchemas/vesselSearchValidation";
import VesselSearchFormContent from "../VesselSearchFormContent/VesselSearchFormContent";
import type { VesselSearchQuery } from "../../../../../../application/vessel/queries/VesselSearchQuery";
import type { Company } from "../../../../../../domain/Types/entities/Company";

interface Props {
  onSubmit: (vesselSearchQuery: VesselSearchQuery) => void;
  companies: Company[];
}

export default function VesselSearchForm({ onSubmit, companies }: Props) {
  const initialValues = {
    imo: "",
    name: "",
    operatorCode: "",
    filterOperator: 0,
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => onSubmit(values)}
      validationSchema={vesselSearchValidation}
    >
      <Form>
        <VesselSearchFormContent companies={companies} />
      </Form>
    </Formik>
  );
}
