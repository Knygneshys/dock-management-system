namespace JadeWesserPort.DTOs.UserDTOs;

public record ValidateActivationResultDto(
    bool Valid,
    string Message,
    string? Email
);