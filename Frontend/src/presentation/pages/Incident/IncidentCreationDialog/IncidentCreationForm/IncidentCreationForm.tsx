import { Form, Formik } from "formik";
import { CreateIncidentCommand } from "../../../../../application/incident/command/CreateIncidentComman";
import { incidentCreationValidation } from "../../../../validation/IncidentValidationSchemas/incidentCreationValidation";
import { useUserContext } from "../../../../context/userContext";
import { Grid } from "@mui/material";
import FormSubmitButton from "../../../../shared/FormComponents/FormSubmitButton/FormSubmitButton";
import FormInputField from "../../../../shared/FormComponents/FormInputField/FormInputField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { useSearchIncidentTypesQuery } from "../../../../state-management/queries/incident-type/useSearchIncidentTypesQuery";
import IncidentTypeSelection from "../../../../shared/EntitySelections/IncidentTypeSelection/IncidentTypeSelection";
import VVEMultiSelection from "../../../../shared/EntitySelections/VVEMultiSelection/VVEMultiSelection";
import { useGetAllVVEsQuery } from "../../../../state-management/queries/vve-queries/useGetAllVVEsQuery";

type Props = {
  onSubmit: (command: CreateIncidentCommand) => void;
};

type FormValues = {
  typeCode: string;
  start: Date;
  end?: Date;
  description: string;
  afectedVVECodes: number[];
};

export default function IncidentCreationForm({ onSubmit }: Props) {
  const initialValues: FormValues = {
    typeCode: "",
    start: new Date(),
    end: undefined,
    description: "",
    afectedVVECodes: []
  };

  const user = useUserContext();
  const incidentTypesQuery = useSearchIncidentTypesQuery({});
  const vvesQuery = useGetAllVVEsQuery();

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={incidentCreationValidation}
      onSubmit={(values) => {
        const command: CreateIncidentCommand = {
          typeCode: values.typeCode,
          description: values.description,
          startISO: values.start.toISOString(),
          afectedVVECodes: values.afectedVVECodes,
          responsibleUserEmail: user.email!,
          ...(values.end !== undefined ? { endISO: values.end.toISOString() } : {})
        };

        onSubmit(command);
      }}
    >
      {({ isSubmitting, setFieldValue, values }) => (
        <Form>
          <Grid container spacing={2} justifyContent={"center"} marginTop={"1em"}>
            <Grid size={12}>
              <FormInputField required label={"Description"} name={"description"} />
            </Grid>

            <Grid size={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  sx={{ width: "100%" }}
                  label="Start"
                  value={values.start ? dayjs(values.start) : null}
                  onChange={(newValue) => setFieldValue("start", newValue)}
                />
              </LocalizationProvider>
            </Grid>

            <Grid size={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  sx={{ width: "100%" }}
                  label="End"
                  value={values.end ? dayjs(values.end) : null}
                  onChange={(newValue) => setFieldValue("end", newValue)}
                />
              </LocalizationProvider>
            </Grid>

            <Grid size={6}>
              <IncidentTypeSelection required={true} name="typeCode" types={incidentTypesQuery.data ?? []} />
            </Grid>

            <Grid size={6}>
              <VVEMultiSelection name="afectedVVECodes" vves={vvesQuery.data ?? []} />
            </Grid>

            <FormSubmitButton label={"Create"} disabled={isSubmitting} />
          </Grid>
        </Form>
      )}
    </Formik>
  );
}
