import {
  Box,
  Button,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import { useState } from "react";

import { userRoles, type UserRole } from "../../../domain/Enums/userRoles";
import useGetAllUsersQuery from "../../state-management/queries/user-queries/useGetAllUsersQuery";
import { useAssignRoleMutation } from "../../state-management/mutations/user-mutations/useAssignRoleMutation";

export default function AssignUserRolePage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const roleKeys = Object.keys(userRoles) as Array<UserRole>;

  const { data: users, isLoading, refetch } = useGetAllUsersQuery();
  const mutation = useAssignRoleMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !role) {
      return;
    }

    await mutation.mutateAsync({ email, role });

    setEmail("");
    setRole("");

    refetch();
  };

  return (
    <Box sx={{ p: 4, maxWidth: 900, mx: "auto" }}>
      <Typography variant="h4" mb={3}>
        Assign User Role
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500, mb: 6 }}>
        <TextField
          label="User E-mail"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 3 }}
        />

        <TextField
          select
          fullWidth
          required
          label="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          sx={{ mb: 3 }}
        >
          {roleKeys.map((r) => (
            <MenuItem key={r} value={r}>
              {r}
            </MenuItem>
          ))}
        </TextField>

        <Button type="submit" variant="contained" fullWidth>
          Assign Role
        </Button>
      </Box>

      <Typography variant="h5" mb={2}>
        Existing Users
      </Typography>

      <Paper sx={{ p: 2 }}>
        {isLoading ? (
          <Typography>Loading users…</Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Active</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {users?.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.role}</TableCell>
                    <TableCell>{u.isActive ? "Activated" : "Not Activated"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}
