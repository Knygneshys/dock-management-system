import { Form, Formik } from "formik";

import { vesselUpdateValidation } from "../../../../../validation/VesselValidationSchemas/vesselUpdateValidation";
import VesselUpdateFormContent from "../VesselUpdateFormContent/VesselUpdateFormContent";
import type { Vessel } from "../../../../../../domain/Types/entities/Vessel";
import type { Company } from "../../../../../../domain/Types/entities/Company";
import type { VesselType } from "../../../../../../domain/Types/entities/VesselType";
import type { UpdateVesselCommand } from "../../../../../../application/vessel/commands/UpdateVesselCommand";

interface Props {
  vessel: Vessel;
  onSubmit: (updatedVessel: UpdateVesselCommand) => void;
  companies: Company[];
  vesselTypes: VesselType[];
}

export default function VesselUpdateForm({
  vessel,
  onSubmit,
  companies,
  vesselTypes,
}: Props) {
  const initialValues: UpdateVesselCommand = {
    imo: vessel.imo,
    name: vessel.name,
    typeCode: vessel.type.code,
    ownerCode: vessel.owner.code,
    operatorCode: vessel.operator.code,
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => onSubmit(values)}
      validationSchema={vesselUpdateValidation}
    >
      <Form>
        <VesselUpdateFormContent
          companies={companies}
          vesselTypes={vesselTypes}
        />
      </Form>
    </Formik>
  );
}
