import { Form, Formik } from "formik";

import StorageAreaCreationFormContent from "../StorageAreaCreationFormContent/StorageAreaCreationFormContent";
import type { StorageAreaCreationDto } from "../../../../../../infrastructure/dtos/storage-area/storageAreaCreationDto";
import { storageAreaCreationValidation } from "../../../../../validation/StorageAreaValidationSchemas/storageAreaCreationValidation";

interface Props {
  onSubmit: (storageArea: StorageAreaCreationDto) => void;
}

export default function StorageAreaCreationForm({ onSubmit }: Props) {
  const initialValues = {
    code: "",
    type: "",
    location: "",
    maxCapacity: 0,
    currentOccupancy: 0,
    width: 0,
    height: 0,
    depth: 0,
    x: 0,
    y: 0,
    z: 0
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={storageAreaCreationValidation}
      onSubmit={(values) => onSubmit(values)}
    >
      <Form>
        <StorageAreaCreationFormContent />
      </Form>
    </Formik>
  );
}
