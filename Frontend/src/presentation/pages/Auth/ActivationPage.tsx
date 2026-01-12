import { useAuth0 } from "@auth0/auth0-react";
import { CheckCircle, Error, HourglassEmpty } from "@mui/icons-material";
import { Box, Button, Card, CardContent, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ActivationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithRedirect, isAuthenticated, getAccessTokenSilently, logout } = useAuth0();

  const token = searchParams.get("token");

  const [status, setStatus] = useState("validating");
  const [message, setMessage] = useState("");
  const [validatedEmail, setValidatedEmail] = useState("");
  const [activationAttempted, setActivationAttempted] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Activation link is invalid or missing.");
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/validate-token?token=${token}`);

        if (response.ok) {
          const data = await response.json();
          setValidatedEmail(data.email);
          setStatus("waiting_signup");
          setMessage(`Please sign up with: ${data.email}`);
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error("[Activation] validate-token ERROR:", response.status, errorData);
          setStatus("error");
          setMessage(errorData.message || "Activation link is invalid or expired.");
        }
      } catch (error) {
        console.error("[Activation] validate-token exception:", error);
        setStatus("error");
        setMessage("An error occurred. Please try again.");
      }
    };

    validateToken();
  }, [token]);

  useEffect(() => {
    const completeActivation = async () => {
      try {
        setStatus("activating");
        setMessage("Activating your account...");

        const accessToken = await getAccessTokenSilently();

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/complete-activation`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({ activationToken: token })
        });

        const TIME_OUT = 3000;

        if (response.ok) {
          const data = await response.json();
          setStatus("success");
          setMessage(`Account activated! You are now a ${data.role}. Redirecting...`);

          localStorage.setItem("activationSuccess", "true");
          localStorage.setItem("activatedRole", data.role);

          setTimeout(async () => {
            await logout({
              logoutParams: {
                returnTo: window.location.origin
              }
            });
          }, TIME_OUT);
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error("[Activation] complete-activation failed:", response.status, errorData);
          setStatus("error");
          setMessage(errorData.message || errorData || "Activation failed.");
        }
      } catch (error) {
        console.error("[Activation] complete-activation exception:", error);
        setStatus("error");
        setMessage("An error occurred during activation.");
      }
    };

    if (isAuthenticated && token && status === "waiting_signup" && !activationAttempted) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActivationAttempted(true);
      completeActivation();
    }
  }, [isAuthenticated, token, getAccessTokenSilently, logout, status, activationAttempted]);

  const handleSignup = () => {
    if (!token) {
      return;
    }

    loginWithRedirect({
      authorizationParams: {
        screen_hint: "signup",
        login_hint: validatedEmail,
        redirect_uri: `${window.location.origin}/activate?token=${token}`
      }
    });
  };

  const getIcon = () => {
    switch (status) {
      case "validating":
      case "activating":
        return <CircularProgress size={80} sx={{ color: "#1976d2" }} />;
      case "waiting_signup":
        return <HourglassEmpty sx={{ fontSize: 80, color: "#ff9800" }} />;
      case "success":
        return <CheckCircle sx={{ fontSize: 80, color: "#4caf50" }} />;
      case "error":
        return <Error sx={{ fontSize: 80, color: "#f44336" }} />;
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (status) {
      case "validating":
        return "Validating Token...";
      case "waiting_signup":
        return "Complete Your Registration";
      case "activating":
        return "Activating Account...";
      case "success":
        return "Account Activated! 🎉";
      case "error":
        return "Activation Failed";
      default:
        return "";
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
        p: 2
      }}
    >
      <Card
        sx={{
          maxWidth: 500,
          width: "100%",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
        }}
      >
        <CardContent sx={{ textAlign: "center", p: 4 }}>
          <Box sx={{ mb: 3 }}>{getIcon()}</Box>

          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
            {getTitle()}
          </Typography>

          <Typography variant="body1" sx={{ color: "#666", mb: 4, lineHeight: 1.6 }}>
            {message}
          </Typography>

          {status === "waiting_signup" && !isAuthenticated && (
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleSignup}
                sx={{
                  background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                  px: 3
                }}
              >
                Sign Up
              </Button>
            </Box>
          )}

          {status === "success" && (
            <Box>
              <Typography variant="body2" sx={{ color: "#999", mt: 2 }}>
                Redirecting to login...
              </Typography>
            </Box>
          )}

          {status === "error" && (
            <Button
              variant="contained"
              onClick={() => navigate("/")}
              sx={{
                background: "linear-gradient(135deg, #f44336 0%, #d32f2f 100%)",
                px: 4
              }}
            >
              Go Home
            </Button>
          )}
        </CardContent>

        <Box
          sx={{
            backgroundColor: "#f5f5f5",
            p: 2,
            borderTop: "1px solid #e0e0e0"
          }}
        >
          <Typography variant="caption" sx={{ color: "#999" }}>
            JadeWeserPort © 2025 - Port Management System
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
