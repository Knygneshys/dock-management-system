import SearchIcon from '@mui/icons-material/Search';
import { Box, TextField } from "@mui/material";

interface Props {
  id: string,
  label: string,
  changeFn: (value: any) => void,
  value: string,
}

function TextSearchBar({ id, label, changeFn } : Props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
      <SearchIcon />
      <TextField
        id={id}
        label={label}
        variant="standard"
        type="search"
        onChange={changeFn}
      />
    </Box>
  );
}

export default TextSearchBar;