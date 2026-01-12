import axios from "axios";
import { MutationCache, QueryClient } from "@tanstack/react-query";
import {
  errorToast,
  successToast,
} from "../../presentation/shared/Toaster/Toaster";

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onSuccess: (_data, _variables, _context, mutation) => {
      const successMessage = mutation.meta?.successMessage as
        | string
        | undefined;
      if (successMessage) {
        successToast(successMessage);
      }
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const backendMessage =
          error?.response?.data ||
          error?.response?.data?.message ||
          error?.message;

        errorToast(backendMessage);
      } else {
        errorToast("Unexpected error occurred!");
      }
    },
    onSettled: (_data, _error, _variables, _context, mutation) => {
      const queryKeys = mutation.meta?.invalidatesQuery as
        | unknown[]
        | undefined;
      if (queryKeys) {
        queryClient.invalidateQueries({
          queryKey: queryKeys,
        });
      }
    },
  }),
});
