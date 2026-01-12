import { Form, Formik } from "formik";
import { CompTaskCategorySearchQuery } from "../../../../../application/complementary-task-category/queries/CompTaskCategorySearchQuery";
import { Grid } from "@mui/material";
import FormInputField from "../../../../shared/FormComponents/FormInputField/FormInputField";
import FormSubmitButton from "../../../../shared/FormComponents/FormSubmitButton/FormSubmitButton";

type Props = {
  initialQuery: CompTaskCategorySearchQuery;
  onSubmit: (searchQuery: CompTaskCategorySearchQuery) => void;
};

export default function CompTaskCategorySearchForm({ initialQuery, onSubmit }: Props) {
  return (
    <Formik initialValues={initialQuery} onSubmit={(values) => onSubmit(values)}>
      <Form>
        <Grid marginTop={"1em"} container spacing={2} justifyContent={"center"}>
          <FormInputField label={"Name"} name={"name"} />
          <FormSubmitButton label={"Search"} />
        </Grid>
      </Form>
    </Formik>
  );
}
