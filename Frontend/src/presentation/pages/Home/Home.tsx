import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        p: 4,
        textAlign: "center"
      }}
    >
      <Typography variant="h4" sx={{ mb: 2 }}>
        {t("welcome1")}
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }}>
        {t("welcome2")}
      </Typography>
    </Box>
  );
}
