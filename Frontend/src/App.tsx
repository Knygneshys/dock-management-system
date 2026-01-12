import { useAuth0 } from "@auth0/auth0-react";
import { Alert, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Cookies from "universal-cookie";

import { routes } from "./presentation/routes";
import LoadingScreen from "./presentation/components/LoadingScreen/LoadingScreen";
import MainLayout from "./presentation/layouts/MainLayout";
import ProtectedRoute from "./presentation/components/ProtectedRoute/ProtectedRoute";
import { UserContext } from "./presentation/context/userContext";
import type { DomainUser } from "./domain/Types/entities/DomainUser";
import {
  ApprovePrivacyPolicyUseCase,
  GetCurrentUserUsecase,
} from "./application/user/UserDI";
import Footer from "./presentation/components/Footer/Footer";
import { useUserApprovePrivacyPolicy } from "./presentation/state-management/mutations/user-mutations/useUserApprovePrivacyPolicy";
import PrivacyPolicyConfirmationDialog from "./presentation/components/PrivacyPolicy/PrivacyPolicyConfirmationDialog";

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
      <Footer />
    </BrowserRouter>
  );
}

function AppContent() {
  const { t } = useTranslation();
  const appRoutes = routes(t);

  const authService = useAuth0();
  const location = useLocation();
  const isActivationPage = location.pathname === "/activate";
  const navigate = useNavigate();
  const cookies = new Cookies();

  const [domainUser, setDomainUser] = useState<DomainUser>({
    ...authService.user,
    role: null!,
    isActive: false,
    hasReadPrivacyPolicy: false,
  } as DomainUser);

  //Handle account activation state
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const activation = params.get("activation");
    const role = params.get("role");

    if (activation === "success" && role) {
      alert(
        `Account activated successfully! You are now a ${role}. Please login to continue.`,
      );
      window.history.replaceState({}, "", window.location.pathname);
      navigate("/");
    }
  }, [navigate]);

  //Handle authentication and set domain user
  useEffect(() => {
    const handleAuth = async () => {
      if (authService.isAuthenticated && authService.user) {
        try {
          const token = await authService.getAccessTokenSilently();
          cookies.set("access_token", token);

          const currUser = await GetCurrentUserUsecase();
          setDomainUser({
            email: authService.user?.email,
            role: currUser.role,
            isActive: currUser.isActive,
            hasReadPrivacyPolicy: currUser.hasReadPrivacyPolicy,
            ...authService.user,
          });
        } catch (error: any) {
          if (error.error === "consent_required") {
            authService.loginWithRedirect({
              authorizationParams: {
                prompt: "consent",
              },
            });
          }
        }
      }
    };
    if (authService.isAuthenticated) handleAuth();
  }, [authService.isAuthenticated, authService.user]);

  if (authService.isLoading) {
    return <LoadingScreen />;
  }

  //Handle not authenticated users
  if (!authService.isAuthenticated) {
    authService.loginWithRedirect();
    return <LoadingScreen />;
  }

  if (authService.isAuthenticated && !domainUser.role && !isActivationPage) {
    return <LoadingScreen />;
  }

  if (
    authService.isAuthenticated &&
    domainUser.isActive === false &&
    !isActivationPage
  ) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Alert
          severity="warning"
          sx={{ maxWidth: 600 }}
          action={<button onClick={() => authService.logout()}>Logout</button>}
        >
          <strong>Account Not Activated</strong>
          <p>
            Your account is pending activation. Please check your email for the
            activation link or contact an administrator.
          </p>
        </Alert>
      </Box>
    );
  }

  return (
    <UserContext value={domainUser}>
      <Routes>
        <Route element={<MainLayout />}>
          {appRoutes.map(
            ({ route, component: Component, isProtected, allowed }) => (
              <Route
                key={route}
                path={route}
                element={
                  isProtected ? (
                    <ProtectedRoute allowedRoles={allowed}>
                      <Component />
                    </ProtectedRoute>
                  ) : (
                    <Component />
                  )
                }
              />
            ),
          )}
        </Route>
      </Routes>
    </UserContext>
  );
}
