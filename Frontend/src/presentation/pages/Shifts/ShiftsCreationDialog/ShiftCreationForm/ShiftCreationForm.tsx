import dayjs from "dayjs";
import { Form, Formik } from "formik";
import ShiftCreationFormContent from "../ShiftCreationFormContent/ShiftCreationFormContent";
import type { ShiftCreateDto } from "../../../../../infrastructure/dtos/shift/shiftCreateDto";
import type { StaffMember } from "../../../../../domain/Types/entities/StaffMember";
import type { Resource } from "../../../../../domain/Types/entities/Resource";

interface Props {
  onSubmit: (shiftCreateDto: ShiftCreateDto, mNumber: number) => void;
  staffMembers?: StaffMember[];
  resources?: Resource[];
  isLoading?: boolean;
}

export default function ShiftCreationForm({
  onSubmit,
  staffMembers,
  resources,
  isLoading,
}: Props) {
  const initialValues = {
    staffMemberId: "",
    resourceCode: "",
    date: null,
    fromTime: null,
    toTime: null,
  };

  const handleSubmit = (values: any) => {
    const date = dayjs(values.date);
    const fromTime = dayjs(values.fromTime);
    const toTime = dayjs(values.toTime);
    const FIX_BACKEND_DATE_TYPE = 1;

    const shiftCreateDto = {
      day: date.date(),
      month: date.month() + FIX_BACKEND_DATE_TYPE,
      year: date.year(),
      fromHour: fromTime.hour(),
      fromMinute: fromTime.minute(),
      toHour: toTime.hour(),
      toMinute: toTime.minute(),
      resourceCode: values.resourceCode,
    };

    onSubmit(shiftCreateDto, values.staffMemberId);
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      <Form>
        <ShiftCreationFormContent
          staffMembers={staffMembers}
          resources={resources}
          isLoading={isLoading}
        />
      </Form>
    </Formik>
  );
}
