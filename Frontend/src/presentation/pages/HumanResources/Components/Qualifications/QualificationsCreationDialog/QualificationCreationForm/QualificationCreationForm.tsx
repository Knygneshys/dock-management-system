import { Form, Formik } from "formik";
import QualificationCreationFormContent from "../QualificationCreationFormContent/QualificationCreationFormContent";
import type { QualificationCreateDto } from "../../../../../../../infrastructure/dtos/qualification/qualificationCreateDto";
import { qualificationCreationValidation } from "../../../../../../validation/QualificationValidationSchemas/qualificationValidation";

interface Props {
  onSubmit: (qualification: QualificationCreateDto) => void;
}

export default function QualificationCreationForm({ onSubmit }: Props) {
  const initialValues = {
    code: "",
    name: ""
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={qualificationCreationValidation}
      onSubmit={(values) => onSubmit(values)}
    >
      <Form>
        <QualificationCreationFormContent />
      </Form>
    </Formik>
  );
}
