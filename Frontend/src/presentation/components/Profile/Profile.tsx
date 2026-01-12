import { Box, Stack, Typography, Button } from "@mui/material";
import Image from "mui-image";
import { useNavigate } from "react-router-dom";

import { useUserContext } from "../../context/userContext";
import { getFormatedRoleName } from "../../utils/roleNameUtils";


export default function Profile() {
  const user = useUserContext();
  const navigate = useNavigate();
  const userProfilePicture = user.picture ?? "https://media.istockphoto.com/id/1495088043/pt/vetorial/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=1024x1024&w=is&k=20&c=UCg5MWnUTm8MKkxFerw4WSzTsNYUHi7aJIRLx63lsQo=";

  return (
    <>
      <Stack direction={"row"} spacing={2} alignItems="center">
        <Typography sx={{ alignContent: "center" }}>
          Hello, {getFormatedRoleName(user.role)}, {user.name}
        </Typography>
        <Box sx={{ borderRadius: '50%', overflow: 'hidden', width: 64, height: 64 }}>
          <Image
            src={userProfilePicture}
            fit="cover"
            width={64}
            height={64}
          />
        </Box>
      </Stack>
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" color="primary" onClick={() => navigate("/user/data-rights") }>
          My Data Rights
        </Button>
      </Box>
    </>
  );
}
