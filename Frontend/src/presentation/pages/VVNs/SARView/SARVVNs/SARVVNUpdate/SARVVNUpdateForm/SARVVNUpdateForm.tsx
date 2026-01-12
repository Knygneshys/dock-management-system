import { Grid } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Form, Formik } from "formik";

import VesselTextBoxAutocomplete from "../../../../../../shared/EntitySelections/VesselTextBoxAutocomplete/VesselTextBoxAutocomplete";
import FormSubmitButton from "../../../../../../shared/FormComponents/FormSubmitButton/FormSubmitButton";
import type { VVN } from "../../../../../../../domain/Types/entities/VVN";
import { useUpdateVVNMutation } from "../../../../../../state-management/mutations/vvn-mutations/useUpdateVVNMutation";
import type { VVNEditDto } from "../../../../../../../infrastructure/dtos/vvn/vvnEditDto";

interface Props {
  vvn: VVN;
  onCreation: () => void;
}

function SARVVNUpdateForm({ vvn, onCreation }: Props) {
  const initialValues = {
    eta: vvn.eta,
    etd: vvn.etd,
    vesselImo: vvn.vessel.imo,
  };

  const updateVVNMutation = useUpdateVVNMutation();

  const onSubmit = async (
    vvnUpdateDto: VVNEditDto,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      await updateVVNMutation.mutateAsync({ vvnUpdateDto, vvnCode: vvn.code });
      onCreation();
    } catch {
      //emp
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {({ isSubmitting }) => (
        <Form>
          <Grid
            container
            spacing={2}
            justifyContent={"center"}
            marginTop={"1em"}
          >
            <Grid size={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  sx={{ width: "100%" }}
                  label="Estimated Time of Arrival"
                  name="eta"
                />
              </LocalizationProvider>
            </Grid>
            <Grid size={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  sx={{ width: "100%" }}
                  label="Estimated Time of Departure"
                  name="etd"
                />
              </LocalizationProvider>
            </Grid>
            <Grid size={12}>
              <VesselTextBoxAutocomplete name="vesselImo" />
            </Grid>
            <Grid size={12}>
              <FormSubmitButton label="Update" disabled={isSubmitting} />
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}

export default SARVVNUpdateForm;
