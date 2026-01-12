import { Form, Formik } from "formik";
import { UpdateIncidentTypeCommand } from "../../../../../application/incident-type/command/UpdateIncidentTypeCommand";
import { IncidentType } from "../../../../../domain/Types/entities/IncidentType";
import IncidentTypeUpdateDialogFormContent from "../IncidentTypeUpdateDialogFormContent/IncidentTypeUpdateDialogFormContent";
import { incidentTypeUpdateValidation } from "../../../../validation/IncidentTypeSchemas/incidentTypeUpdateValidation";

interface Props {
  incidentType: IncidentType;
  onSubmit: (command: UpdateIncidentTypeCommand) => void;
}

export default function IncidentTypeUpdateDialogForm({
  incidentType,
  onSubmit,
}: Props) {
  const initialValues: UpdateIncidentTypeCommand = {
    name: incidentType.name,
    description: incidentType.description,
    severity: incidentType.severity,
    parentIncidentTypeCode: incidentType.parentIncidentTypeCode ?? "",
  };

  const handleSubmit = (values: UpdateIncidentTypeCommand) => {
    const transformedValues = {
      ...values,
      parentIncidentTypeCode: values.parentIncidentTypeCode || null,
    };
    onSubmit(transformedValues);
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={incidentTypeUpdateValidation}
    >
      <Form>
        <IncidentTypeUpdateDialogFormContent />
      </Form>
    </Formik>
  );
}
