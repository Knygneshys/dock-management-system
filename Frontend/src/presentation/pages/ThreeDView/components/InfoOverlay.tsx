import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { useUserContext } from "../../../context/userContext";
import { userRoles, type UserRole } from "../../../../domain/Enums/userRoles";

const canSeeRestricted = (role: UserRole) =>
  role === userRoles.SystemAdmin || role === userRoles.PortAuthorityOfficer || role === userRoles.LogisticsOperator;

function formatName(name: string) {
  if (!name) return "";
  return name
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const pick = (obj: any, pascal: any, camel: any) => obj?.[pascal] ?? obj?.[camel];

async function fetchDetails(selection: any, signal: any) {
  if (!selection?.code || !selection?.kind) return null;

  const baseUrl = import.meta.env.VITE_API_URL;
  const cookies = new Cookies();
  const token = cookies.get("access_token");

  let url: any;
  switch (selection.kind) {
    case "dock":
      url = `${baseUrl}/api/DockRecords/${encodeURIComponent(selection.code)}`;
      break;

    case "storage":
      url = `${baseUrl}/api/StorageAreas/${encodeURIComponent(selection.code)}`;
      break;

    case "resource":
      url = `${baseUrl}/api/Resources/${encodeURIComponent(selection.code)}`;
      break;

    case "vessel":
      break;
  }

  const res = await fetch(url, {
    signal,
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });

  if (res.status === 401) {
    return { __restricted: true, __reason: "unauthorized" };
  }

  if (res.status === 403) {
    return { __restricted: true, __reason: "forbidden" };
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("DETAILS ERROR", res.status, url, text);
    return null;
  }
  const data = await res.json();

  if (selection.kind === "vessel") {
    return null;
  }

  return data;
}

function renderBasic(selection: any, details: any) {
  const b = selection?.basic ?? {};

  const title = b.name ?? b.Name ?? pick(details, "Name", "name") ?? formatName(selection?.name);

  const description = b.description ?? b.Description ?? pick(details, "Description", "description") ?? null;

  const kind = selection?.kind;

  return (
    <>
      <Typography variant="subtitle1" fontWeight={600}>
        {title}
      </Typography>

      {description && (
        <Typography variant="body2">
          <b>Description:</b> {description}
        </Typography>
      )}

      {kind === "dock" && (
        <>
          <Typography variant="body2">
            <b>Location:</b> {b.location ?? b.Location ?? pick(details, "Location", "location") ?? "—"}
          </Typography>
          <Typography variant="body2">
            <b>Length:</b> {b.length ?? b.Length ?? pick(details, "Length", "length") ?? "—"} m
          </Typography>
          <Typography variant="body2">
            <b>Depth:</b> {b.depth ?? b.Depth ?? pick(details, "Depth", "depth") ?? "—"} m
          </Typography>
          <Typography variant="body2">
            <b>Max draft:</b> {b.maxDraft ?? b.MaxDraft ?? pick(details, "MaxDraft", "maxDraft") ?? "—"} m
          </Typography>
        </>
      )}

      {kind === "storage" && (
        <Typography variant="body2">
          <b>Capacity:</b> {b.maxCapacity ?? b.MaxCapacity ?? pick(details, "MaxCapacity", "maxCapacity") ?? "—"}
        </Typography>
      )}

      {kind === "vessel" && (
        <>
          <Typography variant="body2">
            <b>IMO:</b> {selection.name ?? "—"}
          </Typography>

          <Typography variant="body2">
            <b>Visit code:</b> {selection.code ?? "—"}
          </Typography>

          <Typography variant="body2">
            <b>Status:</b> {selection.status ?? "—"}
          </Typography>

          <Typography variant="body2">
            <b>Dock:</b> {selection.dockCode ?? "—"}
          </Typography>
        </>
      )}
    </>
  );
}

function renderRestrictedBlock(details: any, kind: any) {
  if (!details || details?.__restricted) {
    return (
      <Typography variant="body2" sx={{ mt: 1, opacity: 0.85 }}>
        Some information is restricted for your role.
      </Typography>
    );
  }

  switch (kind) {
    case "storage":
      return (
        <Typography variant="body2" sx={{ mt: 1 }}>
          <b>Occupancy:</b> {pick(details, "CurrentOccupancy", "currentOccupancy")}
        </Typography>
      );

    case "resource":
      return (
        <>
          <Typography variant="body2" sx={{ mt: 1 }}>
            <b>Status:</b> {pick(details, "Status", "status")}
          </Typography>
          <Typography variant="body2">
            <b>Setup time:</b> {pick(details, "SetupTimeMinutes", "setupTimeMinutes")} min
          </Typography>
        </>
      );

    default:
      return null;
  }
}

export default function InfoOverlay() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [selection, setSelection] = useState<any>(null);
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const user = useUserContext();
  const role = user?.role;

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "i" || event.key === "I") setIsVisible((p) => !p);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleSelectionChange = (event: any) => {
      setSelection(event.detail ?? null);
    };
    window.addEventListener("port-selection-changed", handleSelectionChange);
    return () => window.removeEventListener("port-selection-changed", handleSelectionChange);
  }, []);

  useEffect(() => {
    if (!isVisible || !selection?.code) {
      setDetails(null);
      setLoading(false);
      return;
    }

    if (selection.kind === "vessel") {
      setDetails(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    fetchDetails(selection, controller.signal)
      .then((data) => setDetails(data))
      .catch((err) => {
        if (err?.name !== "AbortError") setDetails(null);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [isVisible, selection]);

  if (!isVisible) return null;

  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        zIndex: 10,
        pointerEvents: "none",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "flex-start",
        p: 2,
        boxSizing: "border-box"
      }}
    >
      <Box
        sx={{
          pointerEvents: "none",
          userSelect: "text",
          minWidth: 260,
          maxWidth: 340,
          bgcolor: "rgba(0,0,0,0.6)",
          color: "#fff",
          borderRadius: 2,
          p: 2,
          backdropFilter: "blur(6px)",
          fontSize: "0.875rem"
        }}
      >
        {selection ? (
          <>
            {renderBasic(selection, details)}

            {loading ? (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Loading latest information…
              </Typography>
            ) : canSeeRestricted(role) ? (
              renderRestrictedBlock(details, selection.kind)
            ) : (
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.85 }}>
                Some information is restricted for your role.
              </Typography>
            )}

            <Typography variant="caption" sx={{ opacity: 0.7, display: "block", mt: 1 }}>
              Press <b>"i"</b> to hide the overlay.
            </Typography>
          </>
        ) : (
          <Typography variant="body2">No element selected. Click on a facility or vessel in the 3D view.</Typography>
        )}
        <Typography variant="caption" sx={{ opacity: 0.7, display: "block", mt: 0.5 }}>
          Press <b>"R"</b> to reset the camera view.
        </Typography>
      </Box>
    </Box>
  );
}
