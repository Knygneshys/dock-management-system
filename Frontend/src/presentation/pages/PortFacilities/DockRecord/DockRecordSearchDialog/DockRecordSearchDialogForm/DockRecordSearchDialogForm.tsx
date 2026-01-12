/* eslint-disable max-len */
import { Form, Formik } from "formik";

import DockRecordSearchDialogFormContent from "../DockRecordSearchDialogFormContent/DockRecordSearchDialogFormContent";
import type { DockRecordSearchQuery } from "../../../../../../application/dock-record/queries/DockRecordSearchQuery";
import { dockRecordSearchValidation } from "../../../../../validation/DockValidationSchemas/dockRecordSearchValidation";

interface Props {
  onSubmit: (searchQuery: DockRecordSearchQuery) => void;
}

export default function DockRecordSearchDialogForm({ onSubmit }: Props) {
  const initialValues = {
    name: "",
    location: "",
    vesselType: "",
    filterOperator: 0
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => onSubmit(values)}
      validationSchema={dockRecordSearchValidation}
    >
      <Form>
        <DockRecordSearchDialogFormContent />
      </Form>
    </Formik>
  );
}
