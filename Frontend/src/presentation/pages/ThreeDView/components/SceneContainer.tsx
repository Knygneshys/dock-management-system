import { Box } from "@mui/material";
import { useEffect, useRef } from "react";

import InfoOverlay from "./InfoOverlay";
import { createPortScene } from "./PortScene";

export default function SceneContainer() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const cleanup = createPortScene(mountRef.current);
    return cleanup;
  }, []);

  return (
    <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
      <Box
        ref={mountRef}
        sx={{
          width: "100%",
          height: "100%"
        }}
      />
      <InfoOverlay />
    </Box>
  );
}
