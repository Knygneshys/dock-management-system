import { Form, Formik } from "formik";
import { dockRecordCreationValidation } from "../../../../../validation/DockValidationSchemas/dockRecordCreationValidation";
import DockRecordCreationFormContent from "../DockRecordCreationFormContent/DockRecordCreationFormContent";
import type { DockRecordCreateDto } from "../../../../../../infrastructure/dtos/dock-record/DockRecordCreateDto";

interface Props {
  onSubmit: (recordCreateDto: DockRecordCreateDto) => void;
}

export default function DockRecordCreationForm({ onSubmit }: Props) {
  const initialValues: DockRecordCreateDto = {
    name: "",
    location: "",
    length: 0,
    depth: 0,
    maxDraft: 0,
    x: -5,
    y: 0,
    z: 0,
    vesselTypeCodes: [],
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={dockRecordCreationValidation}
      onSubmit={(values: DockRecordCreateDto) => onSubmit(values)}
    >
      <Form>
        <DockRecordCreationFormContent />
      </Form>
    </Formik>
  );
}
