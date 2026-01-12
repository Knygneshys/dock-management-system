import { Form, Formik } from "formik";
import { SearchIncidentTypesQuery } from "../../../../../application/incident-type/queries/SearchIncidentTypesQuery";
import IncidentSearchFormContent from "../IncidentSearchFormContent/IncidentSearchFormContent";
import { SeverityClassification } from "../../../../../domain/Enums/severityClassification";
import { incidentTypeSearchValidation } from "../../../../validation/IncidentTypeSchemas/incidentSearchValidation";

interface Props {
  onSubmit: (query: SearchIncidentTypesQuery) => void;
}

export default function IncidentSearchForm({ onSubmit }: Props) {
  const initialValues: SearchIncidentTypesQuery = {
    code: "",
    parentIncidentTypeCode: "",
    description: "",
    severity: "",
  };

  const handleSubmit = (values: SearchIncidentTypesQuery) => {
    onSubmit(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={incidentTypeSearchValidation}
    >
      <Form>
        <IncidentSearchFormContent />
      </Form>
    </Formik>
  );
}
