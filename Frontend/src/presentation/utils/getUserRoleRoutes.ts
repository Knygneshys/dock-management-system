import type { Key, ReactNode } from "react";

interface Route {
  isInSideBar: boolean;
  route: Key | null | undefined;
  pageName: ReactNode;
  isProtected?: boolean;
  allowed?: string[];
}

export const getUserRoleRoutes = (routes: Route[], userRole: string): Route[] => {
  return routes.filter((route) => {
    if (!route.isProtected) {
      return true;
    }
    return route.allowed?.includes(userRole) ?? false;
  });
};
