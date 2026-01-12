import { Form, Formik } from "formik";
import { compTaskCategoryCreationValidation } from "../../../../validation/CTCValidationSchemas/compTaskCategoryCreationValidation";
import FormInputField from "../../../../shared/FormComponents/FormInputField/FormInputField";
import { Grid } from "@mui/material";
import FormSubmitButton from "../../../../shared/FormComponents/FormSubmitButton/FormSubmitButton";
import { CreateCompTaskCategoryDTO } from "../../../../../infrastructure/dtos/comp-task-category/CreateCompTaskCategoryDTO";

type Props = {
  onSubmit: (dto: CreateCompTaskCategoryDTO) => void;
};

type FormValues = {
  name: string;
  description: string;
  defaultDelayHour: string;
  defaultDelayMinute: string;
};

const toIntOrUndef = (v: unknown): number | undefined => {
  if (v === "" || v === null || v === undefined) return undefined;

  if (typeof v === "number") {
    return Number.isInteger(v) ? v : undefined;
  }

  if (typeof v === "string") {
    const trimmed = v.trim();
    if (!trimmed) return undefined;
    const n = Number(trimmed);
    return Number.isInteger(n) ? n : undefined;
  }

  return undefined;
};

export default function CompTaskCategoryCreationForm({ onSubmit }: Props) {
  const initialValues: FormValues = {
    name: "",
    description: "",
    defaultDelayHour: undefined as any,
    defaultDelayMinute: undefined as any
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={compTaskCategoryCreationValidation}
      onSubmit={(values) => {
        const hour = toIntOrUndef(values.defaultDelayHour);
        const minute = toIntOrUndef(values.defaultDelayMinute);

        const dto: CreateCompTaskCategoryDTO = {
          name: values.name,
          description: values.description,
          ...(hour !== undefined && minute !== undefined ? { defaultDelay: { hour, minute } } : {})
        };

        onSubmit(dto);
      }}
    >
      <Form>
        <Grid marginTop={"1em"} container spacing={2} justifyContent={"center"}>
          <FormInputField required label={"Name"} name={"name"} />
          <FormInputField required label={"Description"} name={"description"} />

          <FormInputField type={"number"} label={"Default delay hour (optional)"} name={"defaultDelayHour"} />
          <FormInputField type={"number"} label={"Default delay minute (optional)"} name={"defaultDelayMinute"} />

          <FormSubmitButton label={"Create"} />
        </Grid>
      </Form>
    </Formik>
  );
}
