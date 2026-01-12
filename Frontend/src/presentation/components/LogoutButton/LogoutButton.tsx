import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mui/material";
import Cookies from "universal-cookie";
import { accentColor } from "../../constants/colorscheme";

export default function LogoutButton() {
  const { logout } = useAuth0();
  const cookies = new Cookies();

  return (
    <Button
      sx={{
        color: "black",
        backgroundColor: accentColor
      }}
      onClick={() => {
        cookies.remove("access_token");
        logout({
          logoutParams: {
            returnTo: window.location.origin
          }
        });
      }}
    >
      Log Out
    </Button>
  );
}
