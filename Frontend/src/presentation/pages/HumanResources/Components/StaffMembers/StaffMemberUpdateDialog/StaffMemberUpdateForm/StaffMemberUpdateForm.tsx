import { Form, Formik } from "formik";

import { staffMemberUpdateValidation } from "../../../../../../validation/StaffMemberValidationSchemas/staffMemberUpdateValidation";

import StaffMemberUpdateFormContent from "../StaffMemberUpdateFormContent/StaffMemberUpdateFormContent";
import type { staffUpdateDto } from "../../../../../../../infrastructure/dtos/staff-member/staffUpdateDto";
import type { StaffMember } from "../../../../../../../domain/Types/entities/StaffMember";

interface StaffMemberUpdateFormProps {
  staffMember: StaffMember;
  onSubmit: (values: StaffMember | staffUpdateDto) => void | Promise<void>;
}

export default function StaffMemberUpdateForm({
  staffMember,
  onSubmit,
}: StaffMemberUpdateFormProps) {
  const initialValues = {
    mecanographicNumber: staffMember.mecanographicNumber,
    name: staffMember.name,
    email: staffMember.email,
    phone: staffMember.phone,
    status: staffMember.status,
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => onSubmit(values)}
      validationSchema={staffMemberUpdateValidation}
      enableReinitialize={true}
    >
      <Form>
        <StaffMemberUpdateFormContent />
      </Form>
    </Formik>
  );
}
