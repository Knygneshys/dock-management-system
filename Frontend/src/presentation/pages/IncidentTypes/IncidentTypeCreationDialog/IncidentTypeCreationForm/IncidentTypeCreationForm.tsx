import { Form, Formik } from "formik";
import { SeverityClassification } from "../../../../../domain/Enums/severityClassification";
import { IncidentType } from "../../../../../domain/Types/entities/IncidentType";
import { incidentTypeCreationValidation } from "../../../../validation/IncidentTypeSchemas/incidentTypeCreationValidation";
import IncidentTypeCreationFormContent from "../IncidentTypeCreationFormContent/IncidentTypeCreationFormContent";

type Props = {
  onSubmit: (incidentType: IncidentType) => void;
};

export default function IncidentTypeCreationForm({ onSubmit }: Props) {
  const initialValues: IncidentType = {
    code: "",
    name: "",
    description: "",
    severity: SeverityClassification.Medium,
    parentIncidentTypeCode: "",
  };

  const handleSubmit = (values: IncidentType) => {
    const transformedValues = {
      ...values,
      parentIncidentTypeCode: values.parentIncidentTypeCode || null,
    };
    onSubmit(transformedValues);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={incidentTypeCreationValidation}
      onSubmit={handleSubmit}
    >
      <Form>
        <IncidentTypeCreationFormContent />
      </Form>
    </Formik>
  );
}
