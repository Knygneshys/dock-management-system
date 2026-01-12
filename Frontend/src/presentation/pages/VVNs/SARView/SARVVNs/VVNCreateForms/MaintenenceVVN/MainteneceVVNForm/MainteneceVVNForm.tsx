import { Grid } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Form, Formik } from "formik";

import VesselTextBoxAutocomplete from "../../../../../../../shared/EntitySelections/VesselTextBoxAutocomplete/VesselTextBoxAutocomplete";
import FormInputField from "../../../../../../../shared/FormComponents/FormInputField/FormInputField";
import FormSubmitButton from "../../../../../../../shared/FormComponents/FormSubmitButton/FormSubmitButton";
import dayjs from "dayjs";
import { useCreateMVVNMutation } from "../../../../../../../state-management/mutations/vvn-mutations/create-mutations/useCreateMVVNMutation";
import type { VVNCreateDto } from "../../../../../../../../infrastructure/dtos/vvn/vvnCreateDto";

interface Props {
  onCreation: () => void;
}

function MainteneceVVNForm({ onCreation }: Props) {
  const initialValues = {
    code: 0,
    eta: "",
    etd: "",
    vesselImo: ""
  };

  const createMVVNMutation = useCreateMVVNMutation();

  const onSubmit = async (
    values: VVNCreateDto,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      const vvnCreateDto: VVNCreateDto = {
        code: values.code,
        // @ts-ignore
        eta: values.eta ? values.eta.toISOString() : null,
        // @ts-ignore
        etd: values.etd ? values.etd.toISOString() : null,
        vesselImo: values.vesselImo
      };
      await createMVVNMutation.mutateAsync(vvnCreateDto);
      onCreation();
    } catch {
      //emp
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {({ isSubmitting, setFieldValue, values }) => (
        <Form>
          <Grid container spacing={2} justifyContent={"center"} marginTop={"1em"}>
            <Grid size={12}>
              <FormInputField required id="code" name="code" label="VVN Code" />
            </Grid>

            <Grid size={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  sx={{ width: "100%" }}
                  label="Estimated Time of Arrival"
                  value={values.eta ? dayjs(values.eta) : null}
                  onChange={(newValue) => setFieldValue("eta", newValue)}
                />
              </LocalizationProvider>
            </Grid>

            <Grid size={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  sx={{ width: "100%" }}
                  label="Estimated Time of Departure"
                  value={values.etd ? dayjs(values.etd) : null}
                  onChange={(newValue) => setFieldValue("etd", newValue)}
                />
              </LocalizationProvider>
            </Grid>

            <Grid size={12}>
              <VesselTextBoxAutocomplete name="vesselImo" />
            </Grid>
            <Grid size={12}>
              <FormSubmitButton label="Submit" disabled={isSubmitting} />
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}

export default MainteneceVVNForm;
