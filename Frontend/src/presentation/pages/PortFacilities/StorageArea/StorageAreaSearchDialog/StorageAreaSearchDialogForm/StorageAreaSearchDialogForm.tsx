import { Form, Formik } from "formik";

import StorageAreaSearchDialogFormContent from "../StorageAreaSearchDialogFormContent/StorageAreaSearchDialogFormContent";
import type { StorageAreaSearchQuery } from "../../../../../../application/storage-area/queries/storageAreaSearchQuery";
import { storageAreaSearchValidation } from "../../../../../validation/StorageAreaValidationSchemas/storageAreaSearchValidation";

interface Props {
  onSubmit: (searchQuery: StorageAreaSearchQuery) => void;
}

export default function StorageAreaSearchDialogForm({ onSubmit }: Props) {
  const initialValues = {
    type: "",
    location: "",
    filterOperator: 0
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => onSubmit(values)}
      validationSchema={storageAreaSearchValidation}
    >
      <Form>
        <StorageAreaSearchDialogFormContent />
      </Form>
    </Formik>
  );
}
