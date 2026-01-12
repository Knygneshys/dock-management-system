import { Form, Formik } from "formik";

import { staffMemberCreationValidation } from "../../../../../../validation/StaffMemberValidationSchemas/staffMemberCreationValidation";
import StaffMemberCreationFormContent from "../StaffMemberCreationFormContent/StaffMemberCreationFormContent";
import type { staffCreateDto } from "../../../../../../../infrastructure/dtos/staff-member/staffCreateDto";
import { StaffStatus } from "../../../../../../../domain/Enums/staffStatus";

type StaffMemberCreationFormValues = {
  mecanographicNumber: string;
  name: string;
  email: string;
  phone: string;
  status: StaffStatus;
  qualificationCodes: string[];
};

interface StaffMemberCreationFormProps {
  onSubmit: (values: staffCreateDto) => void | Promise<void>;
}

export default function StaffMemberCreationForm({ onSubmit }: StaffMemberCreationFormProps) {
  const initialValues: StaffMemberCreationFormValues = {
    mecanographicNumber: "",
    name: "",
    email: "",
    phone: "",
    status: StaffStatus.AVAILABLE,
    qualificationCodes: []
  };

  return (
    <Formik<StaffMemberCreationFormValues>
      initialValues={initialValues}
      validationSchema={staffMemberCreationValidation}
      onSubmit={(values) => {
        const dto: staffCreateDto = {
          mecanographicNumber: Number(values.mecanographicNumber),
          name: values.name,
          email: values.email,
          phone: Number(values.phone),
          status: values.status as StaffStatus,
          qualificationCodes: values.qualificationCodes,
          isActive: true
        };

        onSubmit(dto);
      }}
    >
      <Form>
        <StaffMemberCreationFormContent />
      </Form>
    </Formik>
  );
}
