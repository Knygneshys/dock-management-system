import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { PrivacyPolicy } from "../../../../../domain/Types/entities/PrivacyPolicy";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

type Props = {
  privacyPolicies: PrivacyPolicy[];
  handleViewPrivacyPolicyContent: (version: number) => void;
};

export default function PrivacyPolicyTable({
  privacyPolicies,
  handleViewPrivacyPolicyContent: viewPrivacyPolicyContent,
}: Props) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Version</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {privacyPolicies.map((privacyPolicy: PrivacyPolicy) => {
            const creationDate = new Date(privacyPolicy.createdAt);

            return (
              <TableRow key={privacyPolicy.version}>
                <TableCell>{privacyPolicy.version}</TableCell>
                <TableCell>{creationDate.toLocaleString()}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      viewPrivacyPolicyContent(privacyPolicy.version);
                    }}
                  >
                    <RemoveRedEyeIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
