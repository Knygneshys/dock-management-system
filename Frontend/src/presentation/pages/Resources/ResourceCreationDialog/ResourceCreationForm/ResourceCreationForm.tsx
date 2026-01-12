import { Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useState } from "react";
import ResourceStatusFormSelection from "../../../../shared/EntitySelections/ResourceStatusFormSelection/ResourceStatusFormSelection";
import ResourceTypeFormSelection from "../../../../shared/EntitySelections/ResourceTypeFormSelection/ResourceTypeFormSelection";
import SelectQualificationsDropdown from "../../../../shared/EntitySelections/SelectQualificationsDropdown/SelectQualificationsDropdown";
import FormInputField from "../../../../shared/FormComponents/FormInputField/FormInputField";
import FormSubmitButton from "../../../../shared/FormComponents/FormSubmitButton/FormSubmitButton";
import { resourceCreateValidation } from "../../../../validation/ResourceValidationSchemas/resourceCreateValidation";
import type { ResourceCreateDto } from "../../../../../infrastructure/dtos/resource/resourceCreateDto";
import { useCreateResourceMutation } from "../../../../state-management/mutations/resource-mutations/useCreateResourceMutation";
import { resourceType } from "../../../../../domain/Enums/resourceType";

interface Props {
  onCreation: () => void;
}

export default function ResourceCreationForm({ onCreation }: Props) {
  const initialValues: ResourceCreateDto = {
    alphanumericCode: "",
    description: "",
    setupTimeMinutes: 0,
    qualifications: [],
    resourceType: "",
    status: "Active",
    dockRecordCode: "",
    storageAreaCode: ""
  };

  const createResourceMutation = useCreateResourceMutation();

  const onSubmit = async (resource: ResourceCreateDto, { setSubmitting }: FormikHelpers<ResourceCreateDto>) => {
    try {
      await createResourceMutation.mutateAsync(resource);
      onCreation();
    } catch {
      //emp
    } finally {
      setSubmitting(false);
    }
  };

  const [isDockCodeDisable, setIsDockCodeDisable] = useState(true);
  const [isStorageAreaCodeDisable, setIsStorageAreaCodeDisable] = useState(true);

  const handleTypeChange = (event: { target: { value: any } }) => {
    const selectedType = event.target.value;

    switch (selectedType) {
      case resourceType.STS_CRANE:
        setIsDockCodeDisable(false);
        setIsStorageAreaCodeDisable(true);
        break;
      case resourceType.YARD_CRANE:
        setIsDockCodeDisable(true);
        setIsStorageAreaCodeDisable(false);
        break;
      default:
        setIsDockCodeDisable(true);
        setIsStorageAreaCodeDisable(true);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={resourceCreateValidation} onSubmit={onSubmit}>
      {({ isSubmitting, setFieldValue }) => (
        <Form>
          <Grid marginTop={"1em"} container spacing={2} justifyContent={"center"}>
            <Grid size={6}>
              <FormInputField required label={"Alphanumeric Code"} name={"alphanumericCode"} />
            </Grid>
            <Grid size={6}>
              <FormInputField required type={"number"} label={"Setup Time"} name={"setupTimeMinutes"} />
            </Grid>
            <Grid size={12}>
              <FormInputField required label={"Description"} name={"description"} />
            </Grid>
            <Grid size={12}>
              <SelectQualificationsDropdown name="qualifications" />
            </Grid>
            <Grid size={6}>
              <ResourceTypeFormSelection
                required
                name="resourceType"
                onChange={(event: { target: any }) => {
                  handleTypeChange(event);
                  setFieldValue("resourceType", event.target.value);
                }}
              />
            </Grid>
            <Grid size={6}>
              <ResourceStatusFormSelection required name="status" />
            </Grid>
            <Grid size={6}>
              <FormInputField name="dockRecordCode" label="Dock Code" disabled={isDockCodeDisable} />
            </Grid>
            <Grid size={6}>
              <FormInputField name="storageAreaCode" label="Storage Area Code" disabled={isStorageAreaCodeDisable} />
            </Grid>
            <Grid size={12}>
              <FormSubmitButton label="Create" disabled={isSubmitting} />
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}
