namespace JadeWesserPort.DTOs.UserDTOs;

public record CompleteActivationResultDto(
    bool Success,
    string? ErrorMessage,
    string? Role
);