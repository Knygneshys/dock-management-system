import { Form, Formik } from "formik";

import QualificationSearchFormContent
from "../QualificationSearchFormContent/QualificationSearchFormContent";
import type { QualificationSearchQuery } from "../../../../../../../application/qualification/queries/QualificationSearchQuery";

interface Props{
  onSearch: (searchQuery : QualificationSearchQuery) => void,
}

export default function QualificationSearchForm({ onSearch } : Props) {
  const initialValues = {
    name: '',
    code: '',
    operatorType: 'contains'
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => onSearch(values)}
    >
      {({ resetForm }) => (
        <Form>
          <QualificationSearchFormContent
            onClear={() => {
              resetForm();
            }}
          />
        </Form>
      )}
    </Formik>
  );
}