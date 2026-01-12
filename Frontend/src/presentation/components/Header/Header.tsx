import { Box, MenuItem, Select, Stack, Typography } from "@mui/material";
import i18next from "i18next";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import LogoutButton from "../LogoutButton/LogoutButton";
import Profile from "../Profile/Profile";
import { routes } from "../../routes";
import { accentColor, primaryColor } from "../../constants/colorscheme";

export default function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  const lngs = {
    en: { nativeName: "English" },
    pt: { nativeName: "Português" }
  };
  const SUPPORTED_LANGS = ["en", "pt"] as const;
  type SupportedLang = (typeof SUPPORTED_LANGS)[number];

  const normalizeLang = (lng?: string): SupportedLang | "" => {
    if (!lng) return "";
    const base = lng.split("-")[0];
    return SUPPORTED_LANGS.includes(base as SupportedLang) ? (base as SupportedLang) : "";
  };

  const [language, setLanguage] = useState<SupportedLang | "">(normalizeLang(i18next.language));

  const handleLanguageChange = (lng: string): void => {
    const normalized = normalizeLang(lng);
    setLanguage(normalized);
    if (normalized) i18next.changeLanguage(normalized);
  };

  const getPageTitle = () => {
    const appRoutes = routes(t);
    const currentRoute = appRoutes.find((route) => route.route === location.pathname);
    return currentRoute ? currentRoute.pageName : "JadeWeserPort System";
  };

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: primaryColor,
        color: "white",
        borderBottom: `5px solid ${accentColor}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "50px"
      }}
    >
      <Stack direction={"row"} spacing={3}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {getPageTitle()}
        </Typography>

        <Select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          variant="standard"
          disableUnderline
          sx={{
            color: "white",
            fontWeight: 500,
            fontSize: "0.9rem",
            textTransform: "uppercase",
            "& .MuiSvgIcon-root": { color: "white" },
            "&:hover": { backgroundColor: "transparent" }
          }}
        >
          {Object.keys(lngs).map((lng) => (
            <MenuItem value={lng} key={lng}>
              {lngs[lng as keyof typeof lngs].nativeName}
            </MenuItem>
          ))}
        </Select>
      </Stack>

      <Stack direction={"row"} spacing={3} alignItems={"center"}>
        <Profile />
        <LogoutButton />
      </Stack>
    </Box>
  );
}
