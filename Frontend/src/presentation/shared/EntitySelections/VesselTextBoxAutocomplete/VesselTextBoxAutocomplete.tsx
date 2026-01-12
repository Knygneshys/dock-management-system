import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useField } from "formik";
import { useEffect, useState } from "react";
import type { Vessel } from "../../../../domain/Types/entities/Vessel";
import { useGetAllVesselsQuery } from "../../../state-management/queries/vessel-queries/useGetAllVesselsQuery";

interface Props {
  name: string;
  required?: boolean;
}

function VesselTextBoxAutocomplete({ name, required = false }: Props) {
  const [field, meta, helpers] = useField(name);
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Vessel[]>([]);

  const getAllVesselsQuery = useGetAllVesselsQuery();

  useEffect(() => {
    if (getAllVesselsQuery.data) {
      setOptions(getAllVesselsQuery.data);
    }
  }, [getAllVesselsQuery.data]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (
    _event: React.SyntheticEvent,
    newValue: Vessel | null
  ) => {
    helpers.setValue(newValue ? newValue.imo : "");
    helpers.setTouched(true);
  };

  const selectedValue =
    options.find((option) => option.imo === field.value) || null;

  return (
    <Autocomplete
      fullWidth
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      isOptionEqualToValue={(option, value) => option.imo === value?.imo}
      getOptionLabel={(option) =>
        option ? `${option.name} - ${option.imo}` : ""
      }
      options={options}
      loading={getAllVesselsQuery.isPending}
      value={selectedValue}
      onChange={handleChange}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Vessel"
          required={required}
          error={meta.touched && Boolean(meta.error)}
          helperText={meta.touched && meta.error}
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {getAllVesselsQuery.isPending ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
    />
  );
}

export default VesselTextBoxAutocomplete;
