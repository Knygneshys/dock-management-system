import { Form, Formik } from "formik";

import { qualificationUpdateValidation } from "../../../../../../validation/QualificationValidationSchemas/qualificationUpdateValidation";
import QualificationUpdateFormContent from "../QualificationUpdateFormContent/QualificationUpdateFormContent";
import type { Qualification } from "../../../../../../../domain/Types/entities/Qualification";
import type { QualificationUpdateDto } from "../../../../../../../infrastructure/dtos/qualification/qualificaitonUpdateDto";

interface Props {
  qualification: Qualification;
  onSubmit: (qualification: QualificationUpdateDto) => void;
}

export default function QualificationUpdateForm({
  qualification,
  onSubmit,
}: Props) {
  const initialValues = {
    code: qualification.code,
    name: qualification.name,
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => onSubmit(values)}
      validationSchema={qualificationUpdateValidation}
      enableReinitialize={true}
    >
      <Form>
        <QualificationUpdateFormContent />
      </Form>
    </Formik>
  );
}
