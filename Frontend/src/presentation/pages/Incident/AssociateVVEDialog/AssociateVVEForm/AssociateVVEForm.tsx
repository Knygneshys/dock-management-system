import { Form, Formik } from "formik";
import { VVEtoIncidentCommand } from "../../../../../application/incident/command/VVEtoIncidentCommand";
import { useGetAllVVEsQuery } from "../../../../state-management/queries/vve-queries/useGetAllVVEsQuery";
import { Grid } from "@mui/material";
import FormSubmitButton from "../../../../shared/FormComponents/FormSubmitButton/FormSubmitButton";
import VVESelection from "../../../../shared/EntitySelections/VVESelection/VVESelection";

type Props = {
  incidentCode: string;
  onSubmit: (command: VVEtoIncidentCommand) => void;
};

type FormValues = {
  vveCode: number;
};

export default function AssociateVVEForm({ onSubmit, incidentCode }: Props) {
  const initialValues: FormValues = {
    vveCode: 0
  };

  const vvesQuery = useGetAllVVEsQuery();

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
              <VVESelection name="vveCode" vves={vvesQuery.data ?? []} />
            </Grid>

            <FormSubmitButton label={"Associate VVE"} disabled={isSubmitting} />
          </Grid>
        </Form>
      )}
    </Formik>
  );
}
