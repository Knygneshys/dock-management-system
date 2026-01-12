import { createContext, useContext } from "react";
import type { DomainUser } from "../../domain/Types/entities/DomainUser";

export const UserContext = createContext<DomainUser | undefined>(undefined);

export const useUserContext = () => {
  const user = useContext(UserContext);

  if (user === undefined) {
    throw new Error("User is missing from UserContext!");
  }

  return user;
};
