import { Form, Formik } from "formik";
import { CompTask } from "../../../../../domain/Types/entities/CompTask";
import { UpdateCompTaskDto } from "../../../../../infrastructure/dtos/complementary-tasks/UpdateCompTaskDto";
import CompTaskUpdateFormContent from "../CompTaskUpdateFormContent/CompTaskUpdateFormContent";

interface Props {
  task: CompTask;
  onSubmit: (updatedTask: UpdateCompTaskDto) => void;
}

export default function ComplementaryTaskUpdateForm({ task, onSubmit }: Props) {
  const initialValues = {
    team: task.team,
    status: task.status,
    end: task.end ? new Date(task.end).toISOString().slice(0, 16) : "",
  };

  const handleSubmit = (values: typeof initialValues) => {
  const dto: any = {};
  
  if (values.team !== initialValues.team) {
    dto.team = values.team;
  }
  
  if (values.status !== initialValues.status) {
    dto.status = values.status;
  }
  
  if (values.end !== initialValues.end && values.end) {
    dto.end = new Date(values.end);
  }
  
  onSubmit(dto);
};

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      enableReinitialize={true}
    >
      <Form>
        <CompTaskUpdateFormContent />
      </Form>
    </Formik>
  );
}