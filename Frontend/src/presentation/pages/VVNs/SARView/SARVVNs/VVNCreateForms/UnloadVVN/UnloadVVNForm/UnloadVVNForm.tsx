/* eslint-disable no-magic-numbers */
import { Divider, Grid } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Form, Formik } from "formik";
import { useState } from "react";

import CargoTypeFormSelection from "../../../../../../../shared/EntitySelections/CargoTypeFormSelection/CargoTypeFormSelection";
import VesselTextBoxAutocomplete from "../../../../../../../shared/EntitySelections/VesselTextBoxAutocomplete/VesselTextBoxAutocomplete";
import FormInputField from "../../../../../../../shared/FormComponents/FormInputField/FormInputField";
import FormSubmitButton from "../../../../../../../shared/FormComponents/FormSubmitButton/FormSubmitButton";
import CargoItemSection from "../../CargoItemForm/CargoItemForm";
import {
  cargoType,
  type CargoType,
} from "../../../../../../../../domain/Enums/cargoType";
import { useCreateUVVNMutation } from "../../../../../../../state-management/mutations/vvn-mutations/create-mutations/useCreateUVVNMutation";
import type { UnloadVVNCreateDto } from "../../../../../../../../infrastructure/dtos/vvn/unloadVVNCreateDto";
import type { UnloadCargoManifestDto } from "../../../../../../../../infrastructure/dtos/cargo-manifest/unloadCargoManifestDto";
import type { CargoItem } from "../../../../../../../../domain/Types/entities/CargoItem";

interface Props {
  onCreation: () => void;
}

interface FormValues {
  code: number;
  eta: null;
  etd: null;
  vesselImo: string;
  manifestCode: string;
  manifestDescription: string;
  cargoType: CargoType;
  containerISO: string;
  description: string;
  from: string;
  to: string;
  bay: number;
  row: number;
  tier: number;
}

function UnloadVVNForm({ onCreation }: Props) {
  const initialValues = {
    code: 0,
    eta: null,
    etd: null,
    vesselImo: "",
    manifestCode: "",
    manifestDescription: "",
    cargoType: cargoType.General,
    containerISO: "",
    description: "",
    from: "",
    to: "",
    bay: 0,
    row: 0,
    tier: 0,
  };

  const createUVVNMutation = useCreateUVVNMutation();

  const onSubmit = async (
    values: FormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      const unloadcargoManifestDTO: UnloadCargoManifestDto = {
        code: values.manifestCode,
        description: values.manifestDescription,
        cargoType: values.cargoType,
        cargoItems: cargoItems,
      };
      const unloadVVNDto: UnloadVVNCreateDto = {
        code: values.code,
        // @ts-ignore
        eta: values.eta ? values.eta.toISOString() : null,
        // @ts-ignore
        etd: values.etd ? values.etd.toISOString() : null,
        vesselImo: values.vesselImo,
        cargoManifestDTO: unloadcargoManifestDTO,
      };
      await createUVVNMutation.mutateAsync(unloadVVNDto);
      onCreation();
    } catch {
      //emp
    } finally {
      setSubmitting(false);
    }
  };

  const [cargoItems, setCargoItems] = useState<CargoItem[]>([]);
  // @ts-ignore
  const onCargoItemAdd = (values, setFieldValue) => {
    const cargoItem = {
      containerISO: values.containerISO,
      description: values.description,
      from: values.from,
      to: values.to,
      vesselContainerPosition: {
        bay: parseInt(values.bay) || 0,
        row: parseInt(values.row) || 0,
        tier: parseInt(values.tier) || 0,
      },
    };

    const newCargoItems = [...cargoItems, cargoItem];
    setCargoItems(newCargoItems);

    setFieldValue("containerISO", "");
    setFieldValue("description", "");
    setFieldValue("bay", 0);
    setFieldValue("row", 0);
    setFieldValue("tier", 0);
  };
  const removeCargoItem = (index: number) => {
    const newCargoItems = cargoItems.filter((_, i) => i !== index);
    setCargoItems(newCargoItems);
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {({ isSubmitting, setFieldValue, values }) => (
        <Form>
          <Grid
            container
            spacing={2}
            justifyContent={"center"}
            marginTop={"1em"}
          >
            <Grid size={12}>
              <FormInputField
                required
                type="number"
                id="code"
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
            <Grid size={6}>
              <FormInputField
                required
                name="manifestCode"
                label="Manifest code"
              />
            </Grid>
            <Grid size={6}>
              <CargoTypeFormSelection name="cargoType" />
            </Grid>
            <Grid size={12}>
              <FormInputField
                required
                name="manifestDescription"
                label="Description"
              />
            </Grid>
            <Grid size={12}>
              <CargoItemSection
                onAddItem={(values) => onCargoItemAdd(values, setFieldValue)}
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

export default UnloadVVNForm;
