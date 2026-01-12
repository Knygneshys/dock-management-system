/* eslint-disable no-magic-numbers */
import { Form, Formik } from "formik";

import DockUpdateFormContent from "../DockUpdateFormContent/DockUpdateFormContent";
import type { DockRecordUpdateDto } from "../../../../../../infrastructure/dtos/dock-record/DockRecordUpdateDto";
import type { DockRecord } from "../../../../../../domain/Types/entities/DockRecord";
import { dockRecordUpdateValidation } from "../../../../../validation/DockValidationSchemas/dockRecordUpdateValidation";

interface Props {
  dockRecord: DockRecord;
  onSubmit: (updatedDockRecord: DockRecordUpdateDto) => void;
}

export default function DockUpdateForm({ dockRecord, onSubmit }: Props) {
  const initialValues = {
    name: dockRecord.name || "",
    location: dockRecord.location || "",
    length: dockRecord.length || 0,
    depth: dockRecord.depth || 0,
    maxDraft: dockRecord.maxDraft || 0,
    x: dockRecord.x || 0,
    y: dockRecord.y || 0,
    z: dockRecord.z || 0,
    vesselTypeCodes: dockRecord.vesselTypeCodes || [],
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      onSubmit={(values: DockRecordUpdateDto) => onSubmit(values)}
      validationSchema={dockRecordUpdateValidation}
    >
      <Form>
        <DockUpdateFormContent />
      </Form>
    </Formik>
  );
}
