import { useMutation, useQueryClient } from "@tanstack/react-query";

import { errorToast, successToast } from "../../../shared/Toaster/Toaster";
import type { CreateSARCommand } from "../../../../application/shipping-agent-rep/commands/CreateSARCommand";
import { createSar } from "../../../../infrastructure/api/clients/sarsApi";
import { getAllSARsQueryKey } from "../../query-keys/sarQueryKeys";

export const useCreateSarMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (command: CreateSARCommand) => {
      return createSar(command);
    },
    onSuccess: async (data) => {
      console.log(`Successfully created representative of email ${data}`);
      await queryClient.invalidateQueries({
        queryKey: getAllSARsQueryKey
      });
      successToast("Representative succefully created!ff");
    },
    onError: async () => {
      errorToast("Ups! The Representative could not be created!");
    }
  });
};
