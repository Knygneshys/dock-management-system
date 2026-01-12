import { Divider, Grid, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Form, Formik, type FormikHelpers } from "formik";
import { useState } from "react";

import CargoItemCodeAdder from "../../../../../../../shared/CargoItemCodeAdder/CargoItemCodeAdder";
import CargoTypeFormSelection from "../../../../../../../shared/EntitySelections/CargoTypeFormSelection/CargoTypeFormSelection";
import VesselTextBoxAutocomplete from "../../../../../../../shared/EntitySelections/VesselTextBoxAutocomplete/VesselTextBoxAutocomplete";
import FormInputField from "../../../../../../../shared/FormComponents/FormInputField/FormInputField";
import FormSubmitButton from "../../../../../../../shared/FormComponents/FormSubmitButton/FormSubmitButton";
import CargoItemSection from "../../CargoItemForm/CargoItemForm";
import { cargoType } from "../../../../../../../../domain/Enums/cargoType";
import { useCreateFVVNMutation } from "../../../../../../../state-management/mutations/vvn-mutations/create-mutations/useCreateFVVNMutation";
import type { FullVVNCreateDto } from "../../../../../../../../infrastructure/dtos/vvn/fullVVNCreateDto";
import type { CargoItem } from "../../../../../../../../domain/Types/entities/CargoItem";
import type { LoadCargoManifestDto } from "../../../../../../../../infrastructure/dtos/cargo-manifest/loadCargoManifestDto";
import type { UnloadCargoManifestDto } from "../../../../../../../../infrastructure/dtos/cargo-manifest/unloadCargoManifestDto";

interface Props {
  onCreation: () => void;
}

function FullVVNForm({ onCreation }: Props) {
  const initialValues = {
    code: 0,
    eta: null,
    etd: null,
    vesselImo: "",
    loadManifestCode: "",
    loadManifestDescription: "",
    loadManifestcargoType: cargoType.General,
    unloadManifestCode: "",
    unloadManifestDescription: "",
    unloadManifestcargoType: cargoType.General,
    from: "",
    to: "",
    bay: 0,
    row: 0,
    tier: 0,
  };

  const createFVVNMutation = useCreateFVVNMutation();

  const [cargoItems, setCargoItems] = useState<CargoItem[]>([]);
  const [cargoItemCodes, setCargoItemCodes] = useState<string[]>([]);

  const onCargoItemAdd = (values: any, setFieldValue: any) => {
    const cargoItem: CargoItem = {
      containerISO: values.containerISO,
      description: values.description,
      from: values.from,
      to: values.to,
      vesselContainerPosition: {
        bay: values.bay,
        row: values.row,
        tier: values.tier,
      },
    };
    setCargoItems([...cargoItems, cargoItem]);

    setFieldValue("containerISO", "");
    setFieldValue("description", "");
    setFieldValue("bay", 0);
    setFieldValue("row", 0);
    setFieldValue("tier", 0);
  };

  const removeCargoItem = (index: number) => {
    setCargoItems(cargoItems.filter((_, i) => i !== index));
  };

  const handleCodesChange = (newCodes: string[]) => {
    setCargoItemCodes(newCodes);
  };

  const onSubmit = async (
    values: any,
    { setSubmitting }: FormikHelpers<typeof initialValues>
  ) => {
    try {
      const cargoUnloadManifestDTO: UnloadCargoManifestDto = {
        code: values.unloadManifestCode,
        description: values.unloadManifestDescription,
        cargoType: values.unloadManifestcargoType,
        cargoItems: cargoItems,
      };
      const cargoLoadManifestDTO: LoadCargoManifestDto = {
        code: values.loadManifestCode,
        description: values.loadManifestDescription,
        cargoType: values.loadManifestcargoType,
        cargoItemCodes: cargoItemCodes,
      };
      const vvnDto: FullVVNCreateDto = {
        code: values.code,
        eta: values.eta ? values.eta.toISOString() : null,
        etd: values.etd ? values.etd.toISOString() : null,
        vesselImo: values.vesselImo,
        cargoUnloadManifestDTO,
        cargoLoadManifestDTO,
      };
      await createFVVNMutation.mutateAsync(vvnDto);
      onCreation();
    } catch {
      // handle errors if needed
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {({ isSubmitting, setFieldValue, values }) => (
        <Form>
          <Grid container spacing={2} justifyContent="center" marginTop="1em">
            <Grid size={12}>
              <FormInputField
                required
                type="number"
                name="code"
                label="VVN Code"
              />
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
            <Typography variant="h5">Load Manifest</Typography>
            <Divider sx={{ width: "100%" }} />
            <Grid size={6}>
              <FormInputField
                required
                name="loadManifestCode"
                label="Manifest code"
              />
            </Grid>
            <Grid size={6}>
              <CargoTypeFormSelection name="loadManifestcargoType" />
            </Grid>
            <Grid size={12}>
              <FormInputField
                required
                name="loadManifestDescription"
                label="Description"
              />
            </Grid>
            <Grid size={12}>
              <CargoItemCodeAdder onCodesChange={handleCodesChange} />
            </Grid>

            <Divider sx={{ width: "100%" }} />

            <Typography variant="h5">Unload Manifest</Typography>
            <Divider sx={{ width: "100%" }} />
            <Grid size={6}>
              <FormInputField
                required
                name="unloadManifestCode"
                label="Manifest code"
              />
            </Grid>
            <Grid size={6}>
              <CargoTypeFormSelection name="unloadManifestcargoType" />
            </Grid>
            <Grid size={12}>
              <FormInputField
                required
                name="unloadManifestDescription"
                label="Description"
              />
            </Grid>
            <Grid size={12}>
              <CargoItemSection
                onAddItem={onCargoItemAdd}
                cargoItems={cargoItems}
                onRemoveItem={removeCargoItem}
                formValues={values}
                setFieldValue={setFieldValue}
              />
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

export default FullVVNForm;
