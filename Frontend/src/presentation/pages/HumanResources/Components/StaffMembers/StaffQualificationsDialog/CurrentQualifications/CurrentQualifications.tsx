import { Box, Chip, Typography } from "@mui/material";

const MINIMUM_QUALIFICATIONS = 0;

interface CurrentQualificationsProps {
  qualifications: string[];
  onRemove: (code: string) => void;
  getQualificationName: (code: string) => string;
}

export default function CurrentQualifications({
  qualifications,
  onRemove,
  getQualificationName,
}: CurrentQualificationsProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
        Current Qualifications
      </Typography>

      {qualifications.length > MINIMUM_QUALIFICATIONS ? (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {qualifications.map((code) => (
            <Chip
              key={code}
              label={getQualificationName(code)}
              onDelete={() => onRemove(code)}
              color="primary"
            />
          ))}
        </Box>
      ) : (
        <Typography color="text.secondary">
          No qualifications assigned
        </Typography>
      )}
    </Box>
  );
}
