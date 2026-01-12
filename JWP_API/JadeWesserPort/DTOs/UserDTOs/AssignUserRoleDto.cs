using JadeWesserPort.Domain.System;

namespace JadeWesserPort.DTOs.UserDTOs;

public class AssignUserRoleDto
{
    public string Email { get; set; } = string.Empty;
    public UserRole Role { get; set; }
}
