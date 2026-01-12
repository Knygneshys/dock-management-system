import { Divider, Grid } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Form, Formik } from "formik";
import { useState } from "react";

import CargoItemCodeAdder from "../../../../../../../shared/CargoItemCodeAdder/CargoItemCodeAdder";
import CargoTypeFormSelection from "../../../../../../../shared/EntitySelections/CargoTypeFormSelection/CargoTypeFormSelection";
import VesselTextBoxAutocomplete from "../../../../../../../shared/EntitySelections/VesselTextBoxAutocomplete/VesselTextBoxAutocomplete";
import FormInputField from "../../../../../../../shared/FormComponents/FormInputField/FormInputField";
import FormSubmitButton from "../../../../../../../shared/FormComponents/FormSubmitButton/FormSubmitButton";
import { cargoType, type CargoType } from "../../../../../../../../domain/Enums/cargoType";
import { useCreateLVVNMutation } from "../../../../../../../state-management/mutations/vvn-mutations/create-mutations/useCreateLVVNMutation";
import type { LoadVVNCreateDto } from "../../../../../../../../infrastructure/dtos/vvn/loadVVNCreateDto";
import type { LoadCargoManifestDto } from "../../../../../../../../infrastructure/dtos/cargo-manifest/loadCargoManifestDto";

interface Props {
  onCreation: () => void;
}

interface FormValues {
  code: number;
  eta: any;
  etd: any;
  vesselImo: string;
  manifestCode: string;
  manifestDescription: string;
  cargoType: CargoType;
}

function LoadVVNForm({ onCreation }: Props) {
  const initialValues = {
    code: 0,
    eta: null,
    etd: null,
    vesselImo: "",
    manifestCode: "",
    manifestDescription: "",
    cargoType: cargoType.General
  };

  const createLVVNMutation = useCreateLVVNMutation();

  const onSubmit = async (
    values: FormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      const loadCargoManifestDTO: LoadCargoManifestDto = {
        code: values.manifestCode,
        description: values.manifestDescription,
        cargoType: values.cargoType,
        cargoItemCodes: cargoItemCodes
      };
      const vvnDto: LoadVVNCreateDto = {
        code: values.code,
        eta: values.eta,
        etd: values.etd,
        vesselImo: values.vesselImo,
        cargoManifestDTO: loadCargoManifestDTO
      };
      await createLVVNMutation.mutateAsync(vvnDto);
      onCreation();
    } catch {
      //emp
    } finally {
      setSubmitting(false);
    }
  };

  const [cargoItemCodes, setCargoItemCodes] = useState<string[]>([]);
  const handleCodesChange = (newCodes: string[]) => {
    setCargoItemCodes(newCodes);
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {({ isSubmitting, setFieldValue, values }) => (
        <Form>
          <Grid container spacing={2} justifyContent={"center"} marginTop={"1em"}>
            <Grid size={12}>
              <FormInputField required type="number" id="code" name="code" label="VVN Code" />
            </Grid>

            <Grid size={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  sx={{ width: "100%" }}
                  label="Estimated Time of Arrival"
                  value={values.eta}
                  onChange={(newValue) => setFieldValue("eta", newValue)}
                />
              </LocalizationProvider>
            </Grid>

            <Grid size={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  sx={{ width: "100%" }}
                  label="Estimated Time of Departure"
                  value={values.etd}
                  onChange={(newValue) => setFieldValue("etd", newValue)}
                />
              </LocalizationProvider>
            </Grid>

            <Grid size={12}>
              <VesselTextBoxAutocomplete name="vesselImo" />
            </Grid>
            <Divider sx={{ width: "100%" }} />
            <Grid size={6}>
              <FormInputField required name="manifestCode" label="Manifest code" />
            </Grid>
            <Grid size={6}>
              <CargoTypeFormSelection name="cargoType" />
            </Grid>
            <Grid size={12}>
              <FormInputField required name="manifestDescription" label="Description" />
            </Grid>
            <Grid size={12}>
              <CargoItemCodeAdder onCodesChange={handleCodesChange} />
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

export default LoadVVNForm;
