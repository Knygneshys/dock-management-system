import { Button, DialogContent } from "@mui/material";
import { Form, Formik } from "formik";
import { operationalWindowUpdateValidation } from "../../../../../../../validation/OWValidationSchemas/owUpdateValidation";
import OperationalWindowUpdateFormContent from "../OWUpdateFormContent/OWUpdateFormContent";
import type { OperationalWindow } from "../../../../../../../../domain/Types/entities/OperationalWindow";
import type { OWCommand } from "../../../../../../../../application/operational-window/commands/OWCommand";
import { accentColor } from "../../../../../../../constants/colorscheme";

interface OperationalWindowUpdateFormProps {
  operationalWindow: OperationalWindow;
  onSubmit: (command: OWCommand) => void | Promise<void>;
}

export default function OperationalWindowUpdateForm({
  operationalWindow,
  onSubmit,
}: OperationalWindowUpdateFormProps) {
  const parseTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    return {
      hours: parseInt(hours, 10),
      minutes: parseInt(minutes, 10),
    };
  };

  const startTime = parseTime(operationalWindow.startTime);
  const endTime = parseTime(operationalWindow.endTime);

  const initialValues: OWCommand = {
    code: operationalWindow.code,
    dayOfWeek: operationalWindow.dayOfWeek,
    startHour: startTime.hours,
    startMinute: startTime.minutes,
    endHour: endTime.hours,
    endMinute: endTime.minutes,
  };

  const handleSubmit = (
    values: OWCommand,
    { setSubmitting }: { setSubmitting: (flag: boolean) => void }
  ) => {
    onSubmit(values);
    setSubmitting(false);
  };

  return (
    <Formik<OWCommand>
      initialValues={initialValues}
      validationSchema={operationalWindowUpdateValidation}
      onSubmit={handleSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        isSubmitting,
      }) => (
        <Form>
          <DialogContent>
            <OperationalWindowUpdateFormContent
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
          </DialogContent>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting}
            sx={{ background: accentColor, mt: 2 }}
          >
            Update
          </Button>
        </Form>
      )}
    </Formik>
  );
}
