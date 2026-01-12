import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Form, Formik } from "formik";

import { operationalWindowCreateValidation } from "../../../../../../validation/OWValidationSchemas/owCreateValidation";

import OperationalWindowCreationDialogContent from "../OWCreationFormContent/OperationalWindowCreationFormContent";
import type { operationalWindowFormDto } from "../../../../../../../infrastructure/dtos/operational-window/OperationalWindowFormDto";
import { accentColor } from "../../../../../../constants/colorscheme";

export default function OperationalWindowCreationDialog({
  isOpen,
  handleClose,
  onSubmit
}: {
  isOpen: boolean;
  handleClose: () => void;
  onSubmit: (values: operationalWindowFormDto) => void | Promise<void>;
}) {
  const initialValues: operationalWindowFormDto = {
    code: "",
    dayOfWeek: "Monday",
    startHour: 8,
    startMinute: 0,
    endHour: 17,
    endMinute: 0
  };

  const handleSubmit = (
    values: operationalWindowFormDto,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    onSubmit(values);
    setSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Operational Window</DialogTitle>

      <Formik<operationalWindowFormDto>
        initialValues={initialValues}
        validationSchema={operationalWindowCreateValidation}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
          <Form>
            <DialogContent>
              <OperationalWindowCreationDialogContent
                values={values}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                handleBlur={handleBlur}
              />
            </DialogContent>

            <DialogActions>
              <Button onClick={handleClose} disabled={isSubmitting}>
                Cancel
              </Button>

              <Button sx={{ background: accentColor }} type="submit" variant="contained" disabled={isSubmitting}>
                Create
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
