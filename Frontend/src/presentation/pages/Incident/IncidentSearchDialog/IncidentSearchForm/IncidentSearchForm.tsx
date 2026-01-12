import { Form, Formik } from "formik";
import { SearchIncidentQuery } from "../../../../../application/incident/queries/SearchIncidentQuery";
import { Grid } from "@mui/material";
import VVESelection from "../../../../shared/EntitySelections/VVESelection/VVESelection";
import { useGetAllVVEsQuery } from "../../../../state-management/queries/vve-queries/useGetAllVVEsQuery";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import FormSubmitButton from "../../../../shared/FormComponents/FormSubmitButton/FormSubmitButton";
import SeverityClassificationDropdown from "../../../../shared/FormComponents/SeverityClassificationDropdown/SeverityClassificationDropdown";
import IncidentStatusDropdown from "../../../../shared/EntitySelections/IncidentStatusDropdown/IncidentStatusDropdown";

type Props = {
  initialQuery: SearchIncidentQuery;
  onSubmit: (searchQuery: SearchIncidentQuery) => void;
};

export default function IncidentSearchForm({ initialQuery, onSubmit }: Props) {
  const vvesQuery = useGetAllVVEsQuery();

  return (
    <Formik initialValues={initialQuery} onSubmit={(values) => onSubmit(values)}>
      {({ isSubmitting, setFieldValue, values }) => (
        <Form>
          <Grid container spacing={2} justifyContent={"center"} marginTop={"1em"}>
            <Grid size={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  sx={{ width: "100%" }}
                  label="Start"
                  value={values.startDate ? dayjs(values.startDate) : null}
                  onChange={(newValue) => setFieldValue("startDate", newValue)}
                />
              </LocalizationProvider>
            </Grid>

            <Grid size={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  sx={{ width: "100%" }}
                  label="End"
                  value={values.endDate ? dayjs(values.endDate) : null}
                  onChange={(newValue) => setFieldValue("endDate", newValue)}
                />
              </LocalizationProvider>
            </Grid>

            <Grid size={6}>
              <VVESelection name="vveCode" vves={vvesQuery.data ?? []} />
            </Grid>

            <Grid size={6}>
              <SeverityClassificationDropdown label={"Severity"} name={"severity"} />
            </Grid>

            <Grid size={6}>
              <IncidentStatusDropdown label={"Status"} name={"status"} />
            </Grid>

            <FormSubmitButton label={"Search"} disabled={isSubmitting} />
          </Grid>
        </Form>
      )}
    </Formik>
  );
}
