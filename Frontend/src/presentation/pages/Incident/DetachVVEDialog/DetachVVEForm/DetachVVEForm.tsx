import { Form, Formik } from "formik";
import { VVEtoIncidentCommand } from "../../../../../application/incident/command/VVEtoIncidentCommand";
import { Grid } from "@mui/material";
import FormSubmitButton from "../../../../shared/FormComponents/FormSubmitButton/FormSubmitButton";
import VVESelection from "../../../../shared/EntitySelections/VVESelection/VVESelection";
import { VVE } from "../../../../../domain/Types/entities/VVE";

type Props = {
  incidentCode: string;
  onSubmit: (command: VVEtoIncidentCommand) => void;
  vves: VVE[];
};

type FormValues = {
  vveCode: number;
};

export default function DetachVVEForm({ onSubmit, incidentCode, vves }: Props) {
  const initialValues: FormValues = {
    vveCode: 0
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        const command: VVEtoIncidentCommand = {
          vveCode: values.vveCode,
          incidentCode
        };

        onSubmit(command);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Grid container spacing={2} justifyContent={"center"} marginTop={"1em"}>
            <Grid size={6}>
              <VVESelection name="vveCode" vves={vves} />
            </Grid>

            <FormSubmitButton label={"Detach"} disabled={isSubmitting} />
          </Grid>
        </Form>
      )}
    </Formik>
  );
}
