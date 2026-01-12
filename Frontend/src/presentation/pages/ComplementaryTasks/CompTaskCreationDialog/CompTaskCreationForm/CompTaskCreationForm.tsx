import { Form, Formik } from "formik";
import { CreateCompTaskDto } from "../../../../../infrastructure/dtos/complementary-tasks/CreateCompTaskDto";
import CompTaskCreationFormContent from "../CompTaskCreationFormContent/CompTaskCreationFormContent";


interface Props {
  onSubmit: (compTask: CreateCompTaskDto) => void;
}

export default function CompTaskCreationForm({ onSubmit }: Props) {
  const initialValues = {
    categoryCode: "",
    vveCode: "",
    team: "",
    start: new Date().toISOString().slice(0, 16),
    impactOnOperations: false,
  };

  const handleSubmit = (values: typeof initialValues) => {
    const dto: CreateCompTaskDto = {
      categoryCode: values.categoryCode,
      vveCode: Number(values.vveCode),
      team: values.team,
      status: "scheduled",
      start: new Date(values.start),
      impactOnOperations: values.impactOnOperations,
    };
    onSubmit(dto);
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      <Form>
        <CompTaskCreationFormContent />
      </Form>
    </Formik>
  );
}