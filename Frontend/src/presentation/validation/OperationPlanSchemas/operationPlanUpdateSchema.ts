import * as Yup from "yup";
import { requiredError } from "../../utils/errorUtils";
import { plannedOperationSchema } from "../PlannedOperationSchemas/plannedOperationSchema";

export const operationPlanUpdateSchema = Yup.object({
  dockCode: Yup.string().required(requiredError("Dock Code")),
  craneCodes: Yup.array()
    .of(Yup.string())
    .min(1, requiredError("Crane Code"))
    .required(requiredError("Crane Code")),
  staffCodes: Yup.array()
    .of(
      Yup.number()
        .integer("Staff Code must be a whole number")
        .typeError("Staff Code must be a number"),
    )
    .min(1, requiredError("Staff Code"))
    .required(requiredError("Staff Code")),
  storageAreaCode: Yup.string().required(requiredError("Storage Area Code")),
  start: Yup.date().required(requiredError("Start")),
  end: Yup.date().required(requiredError("End")),
  usedAlgorithm: Yup.string().required(requiredError("Used Algorithm")),
  creatorUserEmail: Yup.string().required(requiredError("Creators Email")),
  // plannedOperations: plannedOperationSchema,
});
