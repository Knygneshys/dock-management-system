import { Form, Formik } from "formik";
import ExecutedOperationCreationFormContent from "./ExecutedOperationCreationFormContent/ExecutedOperationCreationFormContent";
import { executedOperationCreationValidation } from "../../../../validation/VVEValidationSchemas/executedOperationCreationValidation";
import { ExecutedOperation } from "../../../../../domain/Types/entities/ExecutedOperation";
import { ContainerPosition } from "../../../../../domain/Types/value-objects/ContainerPosition";
import { PlannedOperation } from "../../../../../domain/Types/entities/PlannedOperation";

type Props = {
  containers: string[];
  onSubmit: (executedOperation: ExecutedOperation) => void;
  plannedOperation: PlannedOperation;
};

interface FormValues {
  start: string;
  end: string;
  fromBay: number;
  fromTier: number;
  fromRow: number;
  toBay: number;
  toTier: number;
  toRow: number;
  containerId: string;
}

export default function ExecutedOperationCreationForm({
  containers,
  onSubmit,
  plannedOperation,
}: Props) {
  const initialValues: FormValues = {
    start: plannedOperation.start.toLocaleString(),
    end: plannedOperation.end.toLocaleString(),
    fromBay: plannedOperation.from.bay,
    fromTier: plannedOperation.from.tier,
    fromRow: plannedOperation.from.row,
    toBay: plannedOperation.to.bay,
    toTier: plannedOperation.to.tier,
    toRow: plannedOperation.to.row,
    containerId: plannedOperation.containerId,
  };

  const handleSubmit = (values: FormValues) => {
    const from: ContainerPosition = {
      bay: Number(values.fromBay),
      tier: Number(values.fromTier),
      row: Number(values.fromRow),
    };

    const to: ContainerPosition = {
      bay: Number(values.toBay),
      tier: Number(values.toTier),
      row: Number(values.toRow),
    };

    const executedOperation: ExecutedOperation = {
      start: new Date(values.start),
      end: new Date(values.end),
      from: from,
      to: to,
      containerId: values.containerId,
    };

    onSubmit(executedOperation);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={executedOperationCreationValidation}
      onSubmit={handleSubmit}
    >
      <Form>
        <ExecutedOperationCreationFormContent containers={containers} />
      </Form>
    </Formik>
  );
}
