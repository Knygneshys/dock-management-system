import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./i18n";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material";
import { ToastContainer } from "react-toastify";
import { queryClient } from "./infrastructure/api/queryClient";
import { theme } from "./presentation/constants/theme";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback="loading">
      <Auth0Provider
        domain={import.meta.env.VITE_AUTH0_DOMAIN}
        clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
        authorizationParams={{
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          redirect_uri: window.location.origin
        }}
        cacheLocation="localstorage"
      >
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <App />
            <ToastContainer />
          </ThemeProvider>
        </QueryClientProvider>
      </Auth0Provider>
    </Suspense>
  </StrictMode>
);
