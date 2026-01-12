/* eslint-disable max-len */
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import ResourceTypeSelection from "../../../shared/EntitySelections/ResourceRelatedSelections/ResourceTypeSelection/ResourceTypeSelection";
import TextSearchBar from "../../../shared/Search/SearchBar";
import type { ResourceSearchQuery } from "../../../../application/resource/queries/resourceSearchQuery";
import { resourceStatus } from "../../../../domain/Enums/resourceStatus";

interface Props {
  onChange: (value: any) => void;
  value: ResourceSearchQuery;
}

function ResoureSearchBar({ value, onChange }: Props) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 3 }}>
      <TextSearchBar id="resourceSearchDescription" label="Description" value={value.description} changeFn={onChange} />
      <FormControl variant="standard" sx={{ minWidth: 120 }}>
        <InputLabel id="status-label">Status</InputLabel>
        <Select
          name="resourceSearchStatus"
          labelId="status-label"
          label="Status"
          value={value.status}
          onChange={onChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={resourceStatus.ACTIVE}>{resourceStatus.ACTIVE}</MenuItem>
          <MenuItem value={resourceStatus.INACTIVE}>{resourceStatus.INACTIVE}</MenuItem>
          <MenuItem value={resourceStatus.MAINTENENCE}>{resourceStatus.MAINTENENCE}</MenuItem>
        </Select>
      </FormControl>
      <ResourceTypeSelection onChange={onChange} value={value.type} name="resourceSearchType" />
    </Box>
  );
}

export default ResoureSearchBar;
