import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { useGetQualificationByIdQuery } from "../../../../../state-management/queries/qualification-queries/useGetQualificationByIdQuery";
import { useUpdateQualificationMutation } from "../../../../../state-management/mutations/qualification-mutations/useUpdateQualificationMutation";
import type { QualificationUpdateDto } from "../../../../../../infrastructure/dtos/qualification/qualificaitonUpdateDto";
import QualificationUpdateForm from "./QualificationUpdateForm/QualificationUpdateForm";
import { accentColor } from "../../../../../constants/colorscheme";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  qualificationCode: string;
}

export default function QualificationUpdateDialog({ isOpen, handleClose, qualificationCode }: Props) {
  const dialogTitle = `Update Qualification (Code: ${qualificationCode})`;
  const getQualificationByIdQuery = useGetQualificationByIdQuery(qualificationCode);
  const updateQualificationMutation = useUpdateQualificationMutation(qualificationCode);

  const qualification = getQualificationByIdQuery?.data;

  const onSubmit = (updatedQualification: QualificationUpdateDto) => {
    updateQualificationMutation.mutate(updatedQualification);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle sx={{ textAlign: "center" }}>{dialogTitle}</DialogTitle>
      <DialogContent>
        {qualification ? (
          <QualificationUpdateForm qualification={qualification} onSubmit={onSubmit} />
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
