import axios from "axios";
import type { UserAssignRoleDto } from "../../dtos/user/userAssignRoleDto";
import type { UserDto } from "../../dtos/user/userDto";
import { apiClient } from "../apiClient";
import type { CompleteActivationDto } from "../../dtos/user/completeActivationDto";
import { userUris } from "../api-utils/apiUriUtils";

export const createUser = async (dto: UserDto) => {
  try {
    const res = await apiClient.post<string>(userUris.CREATE, dto);
    const guid = res.data;

    return guid;
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data || error.message || "Failed to create user",
      );
    }
    return null;
  }
};

export const assignRole = async (dto: UserAssignRoleDto) => {
  try {
    const res = await apiClient.post(userUris.ASSIGN_ROLE, dto);
    return res.data as string;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const validateToken = async (token: string) => {
  try {
    const query = new URLSearchParams();
    query.append("token", token);
    const res = await apiClient.get(
      `${userUris.VALIDATE_TOKEN}?${query.toString()}`,
    );
    return res.data as string;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const completeActivation = async (dto: CompleteActivationDto) => {
  try {
    const res = await apiClient.post(userUris.COMPLETE_ACTIVATION, dto);
    return res.data as string;
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data ||
          error.message ||
          "Failed to complete user activation",
      );
    }
    return null;
  }
};

export const getCurrentUser = async () => {
  try {
    const res = await apiClient.get<UserDto>(userUris.GET_CURRENT);

    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getAllUsers = async () => {
  try {
    const res = await apiClient.get<UserDto[]>(userUris.GET_ALL);

    return res.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getUserRole = async (email: string) => {
  try {
    const data = await apiClient.get(userUris.GET_ROLE, {
      params: {
        email: email,
      },
    });

    return data.data;
  } catch (error) {
    console.error(error);
    throw new Error("An error has occured!");
  }
};


export const userApprovePrivacyPolicy = async (email: string) => {
  try {
    const params = new URLSearchParams();
    params.append("email", email);

    const uri = `${userUris.APPROVE_PRIVACY_POLICY}?${params.toString()}`;

    apiClient.put(uri);

    return true;
  } catch (error) {
    console.error(error);
    throw new Error("An error has occured!");
  }
};


export const requestDataRectification = async (fieldsToRectify: Record<string, string | null>) => {
  const response = await apiClient.post("users/me/data-rectification", fieldsToRectify);
  return response.data;
};

export const getMyData = async () => {
  const response = await apiClient.get("users/me/data");
  return response.data;
};
