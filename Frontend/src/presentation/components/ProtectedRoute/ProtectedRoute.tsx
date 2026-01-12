import type { ReactElement } from "react";

import ForbidScreen from "../ForbidScreen/ForbidScreen";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import { useUserContext } from "../../context/userContext";

interface ProtectedRouteProps {
  children: ReactElement;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles = [] }: ProtectedRouteProps) => {
  const user = useUserContext();

  if (!user.role) {
    return <LoadingScreen />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <ForbidScreen />;
  }

  return children;
};

export default ProtectedRoute;