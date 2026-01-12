import type { DomainUser } from "../../domain/Types/entities/DomainUser";
import type { UserAssignRoleDto } from "../dtos/user/userAssignRoleDto";
import type { UserDto } from "../dtos/user/userDto";

export class UserMapper {
  public static domainToDto(domainUser: DomainUser): UserDto {
    return {
      id: domainUser.id,
      email: domainUser.email!,
      role: domainUser.role,
      isActive: domainUser.isActive,
    } as UserDto;
  }

  public static dtoToDomain(userDto: UserDto): DomainUser {
    return {
      id: userDto.id,
      email: userDto.email,
      role: userDto.role,
      isActive: userDto.isActive,
      hasReadPrivacyPolicy: userDto.hasReadPrivacyPolicy,
    } as DomainUser;
  }

  public static domainToAssignRoleDto(
    domainUser: DomainUser,
  ): UserAssignRoleDto {
    return {
      email: domainUser.email!,
      role: domainUser.role,
    } as UserAssignRoleDto;
  }
}
