/* eslint-disable max-len */
import { PrecisionManufacturing } from "@mui/icons-material";
import {
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import ResourceQualifications from "../../../shared/QualificationDisplayMultiline/QualificationDisplayMultiline";
import type { Resource } from "../../../../domain/Types/entities/Resource";
import { resourceStatus } from "../../../../domain/Enums/resourceStatus";

interface Props {
  resources: Resource[];
  onReactivateButtonClick: (resourceCode: string) => void;
  onDeactivateButtonClick: (resourceCode: string) => void;
}

function ResourcesTable({
  resources,
  onReactivateButtonClick,
  onDeactivateButtonClick,
}: Props) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case resourceStatus.ACTIVE:
        return "success";
      case resourceStatus.INACTIVE:
        return "error";
      case resourceStatus.MAINTENENCE:
        return "warning";
      default:
        return "default";
    }
  };
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Code</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Setup Time</TableCell>
            <TableCell>Qualification(s)</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {resources.map((resource: Resource) => (
            <TableRow key={resource.alphanumericCode}>
              <TableCell>{resource.alphanumericCode}</TableCell>
              <TableCell>{resource.description}</TableCell>
              <TableCell>
                <Chip
                  label={resource.status}
                  color={getStatusColor(resource.status)}
                />
              </TableCell>
              <TableCell>{resource.setupTimeMinutes}</TableCell>
              <TableCell>
                <ResourceQualifications
                  qualifications={resource.qualifications}
                />
              </TableCell>
              <TableCell>
                {(resource.status === resourceStatus.ACTIVE ||
                  resource.status === resourceStatus.MAINTENENCE) && (
                  <IconButton
                    onClick={() => {
                      onDeactivateButtonClick(resource.alphanumericCode);
                    }}
                  >
                    <PrecisionManufacturing color="error" />
                  </IconButton>
                )}
                {(resource.status === resourceStatus.INACTIVE ||
                  resource.status === resourceStatus.MAINTENENCE) && (
                  <IconButton
                    onClick={() => {
                      onReactivateButtonClick(resource.alphanumericCode);
                    }}
                  >
                    <PrecisionManufacturing color="success" />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ResourcesTable;
