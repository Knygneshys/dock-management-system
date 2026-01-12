import { Typography } from "@mui/material";
import type { FC } from "react";
import type { Qualification } from "../../../domain/Types/entities/Qualification";

interface ResourceQualificationsProps {
  qualifications: Qualification[];
}

const ResourceQualifications: FC<ResourceQualificationsProps> = ({
  qualifications,
}) => {
  return (
    <>
      {qualifications.map((qualification) => (
        <Typography key={qualification.code}>{qualification.name}</Typography>
      ))}
    </>
  );
};

export default ResourceQualifications;
