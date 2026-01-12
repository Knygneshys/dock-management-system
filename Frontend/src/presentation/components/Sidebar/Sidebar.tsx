import { Box, List, ListItemButton, ListItemText, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import logo from "../../assets/JWP_icon.png";
import { routes } from "../../routes";
import { accentColor, primaryColor } from "../../constants/colorscheme";
import { useUserContext } from "../../context/userContext";
import { getUserRoleRoutes } from "../../utils/getUserRoleRoutes";

export default function Sidebar() {
  const user = useUserContext();
  const userRole = user.role;

  const { t } = useTranslation();
  const appRoutes = routes(t);
  const userRoutes = getUserRoleRoutes(appRoutes, userRole);

  return (
    <Box
      sx={{
        width: 250,
        bgcolor: primaryColor,
        color: "white",
        display: "flex",
        flexDirection: "column",
        p: 2
      }}
    >
      {/* LOGO */}
      <Box sx={{ mb: 3, textAlign: "center" }}>
        <img src={logo} alt="JadeWeserPort Logo" style={{ width: 45, height: "auto" }} />
        <Box sx={{ mt: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: "1rem",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              lineHeight: 1.1
            }}
          >
            JadeWeserPort
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: accentColor,
              fontSize: "0.7rem",
              letterSpacing: "0.1em"
            }}
          >
            System
          </Typography>
        </Box>
      </Box>

      {/* NAVIGATION */}
      <List sx={{ flexGrow: 1 }}>
        {userRoutes.map(
          (route) =>
            route.isInSideBar && (
              <ListItemButton
                key={route.route}
                component={Link}
                to={route.route as string}
                sx={{
                  "&:hover": {
                    bgcolor: accentColor,
                    color: primaryColor
                  },
                  backgroundColor: location.pathname === route.route ? accentColor : "transparent",
                  color: location.pathname === route.route ? primaryColor : "white",
                  borderRadius: 1,
                  mb: 0.5
                }}
              >
                <ListItemText primary={route.pageName} />
              </ListItemButton>
            )
        )}
      </List>
    </Box>
  );
}
