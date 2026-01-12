import { Form, Formik } from "formik";
import { CompTaskSearchQuery } from "../../../../../application/complementary-task/queries/CompTaskSearchQuery";
import CompTaskSearchFormContent from "../CompTaskSearchFormContent/CompTaskSearchFormContent";

interface Props {
  onSearch: (searchQuery: CompTaskSearchQuery) => void;
}

export default function CompTaskSearchForm({ onSearch }: Props) {
  const initialValues = {
    start: "",
    end: "",
    status: "",
  };

  const handleSubmit = (values: typeof initialValues) => {
    const query: CompTaskSearchQuery = {};
    
    if (values.start) {
      query.start = new Date(values.start);
    }
    
    if (values.end) {
      query.end = new Date(values.end);
    }
    
    if (values.status) {
      query.status = values.status;
    }
    
    onSearch(query);
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      {({ resetForm }) => (
        <Form>
          <CompTaskSearchFormContent
            onClear={() => {
              resetForm();
            }}
          />
        </Form>
      )}
    </Formik>
  );
}