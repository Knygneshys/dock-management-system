import { Form, Formik } from "formik";
import { UpdateOperationPlanCommand } from "../../../../../application/operation-plan/commands/UpdateOperationPlanCommand";
import { OperationPlan } from "../../../../../domain/Types/entities/OperationPlan";
import { operationPlanUpdateSchema } from "../../../../validation/OperationPlanSchemas/operationPlanUpdateSchema";
import OperationPlanUpdateFormContent from "./OperationPlanUpdateFormContent/OperationPlanUpdateFormContent";
import { useGetAllStaffMembersQuery } from "../../../../state-management/queries/staff-member-queries/useGetAllStaffMembersQuery";
import { useGetAllResourcesQuery } from "../../../../state-management/queries/resource-queries/useGetAllResourcesQuery";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";
import { Typography } from "@mui/material";

type Props = {
  operationPlan: OperationPlan;
  onSubmit: (command: UpdateOperationPlanCommand) => void;
};

export default function OperationPlanUpdateForm({
  operationPlan,
  onSubmit,
}: Props) {
  const lastElementIndex = operationPlan.plannedOperations.length - 1;

  const initialValues: UpdateOperationPlanCommand = {
    dockCode: operationPlan.dockCode,
    craneCodes: operationPlan.craneCodes,
    staffCodes: operationPlan.staffCodes,
    storageAreaCode: operationPlan.storageAreaCode,
    start: operationPlan.start,
    end: operationPlan.plannedOperations[lastElementIndex].end,
    usedAlgorithm: operationPlan.usedAlgorithm,
    creatorUserEmail: operationPlan.creatorUserEmail,
    plannedOperations: operationPlan.plannedOperations,
  };

  const getAllResourcesQuery = useGetAllResourcesQuery("");
  const getAllStaffQuery = useGetAllStaffMembersQuery();

  if (getAllResourcesQuery.isLoading || getAllStaffQuery.isLoading) {
    return <LoadingScreen />;
  }

  const staff = getAllStaffQuery.data;
  const resources = getAllResourcesQuery.data;

  if (getAllResourcesQuery.isError || !resources) {
    return <Typography>Failed to get resources!</Typography>;
  }

  if (getAllStaffQuery.isError || !staff) {
    return <Typography>Failed to get staff!</Typography>;
  }

  const staffIdArray = staff.map(
    (staffMember) => staffMember.mecanographicNumber,
  );

  const resourceIdArray = resources.map(
    (resource) => resource.alphanumericCode,
  );

  const handleSubmit = (values: UpdateOperationPlanCommand) => {
    values.plannedOperations[lastElementIndex].end = values.end;
    console.log(values);
    onSubmit(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={operationPlanUpdateSchema}
    >
      <Form>
        <OperationPlanUpdateFormContent
          staffIdArray={staffIdArray}
          resourceIdArray={resourceIdArray}
        />
      </Form>
    </Formik>
  );
}
