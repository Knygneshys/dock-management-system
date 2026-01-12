import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";

import { useUpdateStorageAreaMutation } from "../../../../state-management/mutations/storage-area-mutations/useUpdateStorageAreaMutation";
import { useGetStorageAreaByIdQuery } from "../../../../state-management/queries/storage-area-queries/useGetStorageAreaByIdQuery";
import { accentColor } from "../../../../constants/colorscheme";
import StorageAreaUpdateForm from "./StorageAreaUpdateForm/StorageAreaUpdateForm";
import type { StorageAreaUpdateDto } from "../../../../../infrastructure/dtos/storage-area/storageAreaUpdateDto";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  storageAreaCode: string;
}

export default function StorageAreaUpdateDialog({ isOpen, handleClose, storageAreaCode }: Props) {
  const dialogTitle = `Update StorageArea Record (Code: ${storageAreaCode})`;
  const getStorageAreaByIdQuery = useGetStorageAreaByIdQuery(storageAreaCode);
  const updateStorageAreaMutation = useUpdateStorageAreaMutation(storageAreaCode);

  const storageArea = getStorageAreaByIdQuery?.data;

  const onSubmit = (updatedStorageArea: StorageAreaUpdateDto) => {
    updateStorageAreaMutation.mutate(updatedStorageArea, {
      onSuccess: () => {
        handleClose();
      },
      onError: () => {}
    });
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle sx={{ textAlign: "center" }}>{dialogTitle}</DialogTitle>
      <DialogContent>
        {storageArea ? (
          <StorageAreaUpdateForm storageArea={storageArea} onSubmit={onSubmit} />
        ) : (
          <Typography>Loading...</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ backgroundColor: accentColor }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
