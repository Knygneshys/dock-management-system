import { Form, Formik } from "formik";
import { VVESearchQuery } from "../../../../../application/vve/queries/VVESearchQuery";
import VVESearchFormContent from "../VVESearchFormContent/VVESearchFormContent";

interface Props {
  onSearch: (searchQuery: VVESearchQuery) => void;
}

export default function VVESearchForm({ onSearch }: Props) {
  const initialValues = {
    startDate: "",
    startHour: 0,
    startMinute: 0,
    vesselImo: "",
    status: "",
  };

  const handleSubmit = (values: typeof initialValues) => {
    const query: VVESearchQuery = {};
    
    if (values.startDate) {
      const date = new Date(values.startDate);
      date.setHours(Number(values.startHour));
      date.setMinutes(Number(values.startMinute));
      query.start = date;
    }
    
    if (values.vesselImo) {
      query.vesselImo = values.vesselImo;
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
          <VVESearchFormContent
            onClear={() => {
              resetForm();
            }}
          />
        </Form>
      )}
    </Formik>
  );
}