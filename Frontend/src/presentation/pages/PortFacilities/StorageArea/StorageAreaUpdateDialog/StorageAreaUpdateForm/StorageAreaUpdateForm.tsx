/* eslint-disable no-magic-numbers */
import { Form, Formik } from "formik";

import StorageAreaUpdateFormContent from "../StorageAreaUpdateFormContent/StorageAreaUpdateFormContent";
import type { StorageAreaUpdateDto } from "../../../../../../infrastructure/dtos/storage-area/storageAreaUpdateDto";
import type { StorageArea } from "../../../../../../domain/Types/entities/StorageArea";
import { storageAreaUpdateValidation } from "../../../../../validation/StorageAreaValidationSchemas/storageAreaUpdateValidation";

interface Props {
  storageArea: StorageArea;
  onSubmit: (storageArea: StorageAreaUpdateDto) => void;
}

export default function StorageAreaUpdateForm({
  storageArea,
  onSubmit,
}: Props) {
  const initialValues = {
    type: storageArea.type || "",
    location: storageArea.location || "",
    maxCapacity: storageArea.maxCapacity || 0,
    currentOccupancy: storageArea.currentOccupancy || 0,
    width: storageArea.width || 0,
    height: storageArea.height || 0,
    depth: storageArea.depth || 0,
    x: storageArea.x || 0,
    y: storageArea.y || 0,
    z: storageArea.z || 0,
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      onSubmit={(values) => onSubmit(values)}
      validationSchema={storageAreaUpdateValidation}
    >
      <Form>
        <StorageAreaUpdateFormContent />
      </Form>
    </Formik>
  );
}
