import { Box, Typography, Link } from "@mui/material";
import { accentColor, primaryColor } from "../../constants/colorscheme";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: primaryColor,
        color: "white",
        p: { xs: 2, md: 3 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography sx={{ m: 0 }}>
          Need any help? Contact us:{" "}
          <Link
            href="mailto:superadmin@gmail.com"
            underline="always"
            sx={{ color: "inherit", fontWeight: 500 }}
          >
            superadmin@gmail.com
          </Link>
        </Typography>

        <Typography sx={{ m: 0 }}>
          Learn about our privacy policy{" "}
          <Link
            href="/privacy-policy"
            underline="always"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: accentColor }}
          >
            here
          </Link>
        </Typography>
      </Box>

      <Typography
        sx={{
          mt: 1,
          textAlign: "center",
          fontSize: "0.8rem",
          opacity: 0.8,
        }}
      >
        © {new Date().getFullYear()} JWP Support. All rights reserved.
      </Typography>
    </Box>
  );
}
