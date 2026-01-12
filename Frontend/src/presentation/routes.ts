import type { TFunction } from "i18next";
import DataRights from "./pages/UserProfile/DataRights";
import Scheduling from "./pages/Scheduling/Scheduling";
import { userRoles } from "../domain/Enums/userRoles";
import VesselManagement from "./pages/VesselManagement/VesselManagement";
import PageNotFound from "./components/PageNotFound/PageNotFound";
import ActivationPage from "./pages/Auth/ActivationPage";
import Home from "./pages/Home/Home";
import HumanResources from "./pages/HumanResources/HumanResources";
import SARs from "./pages/SARs/SARs";
import Shifts from "./pages/Shifts/Shifts";
import PortFacilities from "./pages/PortFacilities/PortFacilities";
import AssignUserRolePage from "./pages/Admin/AssignUserRolePage";
import Resources from "./pages/Resources/Resources";
import VVNs from "./pages/VVNs/PAOView/VVNs";
import SARView from "./pages/VVNs/SARView/SARView";
import ThreeDPage from "./pages/ThreeDView/ThreeDPage";
import StockItems from "./pages/StockItems/StockItems";
import RebalanceComparison from "./pages/RebalanceDocks/RebalanceComparison";
import ComplementaryTasks from "./pages/ComplementaryTasks/ComplementaryTasks";
import PrivacyPolicy from "./pages/PrivacyPolicy/User/PrivacyPolicy";
import PrivacyPolicyAdministration from "./pages/PrivacyPolicy/Admin/PrivacyPolicyAdministration";
import VVEs from "./pages/VVEs/VVEs";
import MissingPlansPage from "./pages/MissingPlans/MissingPlansPage";
import CompTaskCategories from "./pages/CompTaskCategories/CompTaskCategories";
import IncidentTypes from "./pages/IncidentTypes/IncidentTypes";
import OperationPlan from "./pages/OperationPlans/OperationPlan";
import Incident from "./pages/Incident/Incident";

export const routes = (t: TFunction<"translation", undefined>) => [
  {
    route: "/",
    pageName: t("page-home"),
    isProtected: false,
    isInSideBar: true,
    component: Home
  },
  {
    route: "/activate",
    pageName: "Activate",
    isProtected: false,
    isInSideBar: false,
    component: ActivationPage
  },
  {
    route: "/admin/assign-role",
    pageName: t("page-role-assignment"),
    isProtected: true,
    allowed: [userRoles.SystemAdmin],
    isInSideBar: true,
    component: AssignUserRolePage
  },
  {
    route: "/vessel-management",
    pageName: t("page-vessels"),
    isProtected: true,
    allowed: [userRoles.PortAuthorityOfficer, userRoles.SystemAdmin],
    isInSideBar: true,
    component: VesselManagement
  },
  {
    route: "/shipping-agent-representatives",
    pageName: t("page-sars"),
    isProtected: true,
    allowed: [userRoles.PortAuthorityOfficer, userRoles.SystemAdmin],
    isInSideBar: true,
    component: SARs
  },
  {
    route: "/human-resources",
    pageName: t("page-human-resources"),
    isProtected: true,
    allowed: [userRoles.LogisticsOperator, userRoles.SystemAdmin],
    isInSideBar: true,
    component: HumanResources
  },
  {
    route: "/resources",
    pageName: t("page-resources"),
    isProtected: true,
    allowed: [userRoles.LogisticsOperator, userRoles.SystemAdmin],
    isInSideBar: true,
    component: Resources
  },
  {
    route: "/port-facilities",
    pageName: t("page-port-facilities"),
    isProtected: true,
    allowed: [userRoles.PortAuthorityOfficer, userRoles.SystemAdmin],
    isInSideBar: true,
    component: PortFacilities
  },
  {
    route: "/port-3d",
    pageName: t("page-port-3dview"),
    isProtected: false,
    isInSideBar: true,
    component: ThreeDPage
  },
  {
    route: "/vessel-visit-notifications",
    pageName: t("page-vvns"),
    isProtected: true,
    allowed: [userRoles.PortAuthorityOfficer, userRoles.SystemAdmin],
    isInSideBar: true,
    component: VVNs
  },
  {
    route: "/sar-vessel-visit-notifications",
    pageName: t("page-vvns"),
    isProtected: true,
    allowed: [userRoles.ShippingAgentRepresentative],
    isInSideBar: true,
    component: SARView
  },
  {
    route: "/shifts",
    pageName: t("page-shifts"),
    isProtected: true,
    allowed: [userRoles.LogisticsOperator, userRoles.SystemAdmin],
    isInSideBar: true,
    component: Shifts
  },
  {
    route: "/scheduling",
    pageName: t("page-scheduling"),
    isProtected: true,
    allowed: [userRoles.LogisticsOperator, userRoles.SystemAdmin],
    isInSideBar: true,
    component: Scheduling
  },
  {
    route: "/stock-items",
    pageName: t("page-stock"),
    isProtected: true,
    allowed: [userRoles.PortAuthorityOfficer, userRoles.SystemAdmin],
    isInSideBar: true,
    component: StockItems
  },
  {
    route: "*",
    pageName: "Not Found",
    isProtected: false,
    isInSideBar: false,
    component: PageNotFound
  },
  {
    route: "/rebalance-comparison",
    pageName: "Dock Rebalancing",
    isProtected: true,
    allowed: [userRoles.PortAuthorityOfficer, userRoles.SystemAdmin],
    isInSideBar: true,
    component: RebalanceComparison
  },
  {
    route: "/complementary-tasks",
    pageName: "Complementary Tasks",
    isProtected: true,
    allowed: [userRoles.PortAuthorityOfficer, userRoles.SystemAdmin],
    isInSideBar: true,
    component: ComplementaryTasks
  },
  {
    route: "/complementary-task-categories",
    pageName: t("page-comp-task-categories"),
    isProtected: true,
    allowed: [userRoles.PortAuthorityOfficer, userRoles.SystemAdmin],
    isInSideBar: true,
    component: CompTaskCategories
  },
  {
    route: "/vessel-visit-execution",
    pageName: "Vessel Visit Executions",
    isProtected: true,
    allowed: [userRoles.PortAuthorityOfficer, userRoles.SystemAdmin],
    isInSideBar: true,
    component: VVEs
  },
  {
    route: "/user/data-rights",
    pageName: "Data Rights",
    isProtected: true,
    allowed: [userRoles.SystemAdmin, userRoles.PortAuthorityOfficer, userRoles.LogisticsOperator, userRoles.ShippingAgentRepresentative],
    isInSideBar: true,
    component: DataRights
  },
  {
    route: "/incident-types",
    pageName: "Incident Types",
    isProtected: true,
    allowed: [userRoles.SystemAdmin, userRoles.LogisticsOperator],
    isInSideBar: true,
    component: IncidentTypes
  },
  {
    route: "/operation-plans",
    pageName: t("page-operation-plans"),
    isProtected: true,
    allowed: [userRoles.PortAuthorityOfficer, userRoles.SystemAdmin],
    isInSideBar: true,
    component: OperationPlan
  },
  {
    route: "/privacy-policy",
    pageName: "Privacy Policy",
    isProtected: false,
    isInSideBar: false,
    component: PrivacyPolicy
  },
  {
    route: "/privacy-policy-administration",
    pageName: "Privacy Policy",
    isProtected: true,
    allowed: [userRoles.SystemAdmin],
    isInSideBar: true,
    component: PrivacyPolicyAdministration
  },
  {
    route: "/missing-plans",
    pageName: "Missing Plans",
    isProtected: true,
    allowed: [userRoles.PortAuthorityOfficer, userRoles.SystemAdmin],
    isInSideBar: true,
    component: MissingPlansPage
  },
  {
    route: "/incidents",
    pageName: t("page-incident"),
    isProtected: true,
    allowed: [userRoles.PortAuthorityOfficer, userRoles.SystemAdmin],
    isInSideBar: true,
    component: Incident
  }
];
