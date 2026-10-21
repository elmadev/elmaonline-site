import styled from '@emotion/styled';
import Autocomplete from '@mui/material/Autocomplete';
import { TextField } from '@mui/material';

export type TagOption = {
  TagIndex: number;
  Name: string;
};

type TagChange = (event: React.SyntheticEvent, tags: TagOption[]) => void;

type TagFilterProps = {
  tagOptions: TagOption[];
  selectedTags: TagOption[];
  onSelectedTagsChange: TagChange;
  excludedTags: TagOption[];
  onExcludedTagsChange: TagChange;
};

const TagFilter = ({
  tagOptions,
  selectedTags,
  onSelectedTagsChange,
  excludedTags,
  onExcludedTagsChange,
}: TagFilterProps) => (
  <>
    <Filter
      value={selectedTags}
      onChange={onSelectedTagsChange}
      forcePopupIcon={false}
      multiple
      id="Tags"
      size="small"
      options={tagOptions.filter(
        tag => !excludedTags.find(t => t.TagIndex === tag.TagIndex),
      )}
      getOptionLabel={option => option.Name}
      isOptionEqualToValue={(option, value) => option.Name === value.Name}
      filterSelectedOptions
      renderInput={params => (
        <TextField variant="standard" {...params} placeholder="Included tags" />
      )}
      ChipProps={{ color: 'primary' }}
    />
    <Filter
      value={excludedTags}
      onChange={onExcludedTagsChange}
      forcePopupIcon={false}
      multiple
      id="Excluded tags"
      size="small"
      options={tagOptions.filter(
        tag => !selectedTags.find(t => t.TagIndex === tag.TagIndex),
      )}
      getOptionLabel={option => option.Name}
      isOptionEqualToValue={(option, value) => option.Name === value.Name}
      filterSelectedOptions
      renderInput={params => (
        <TextField variant="standard" {...params} placeholder="Excluded tags" />
      )}
      ChipProps={{ color: 'secondary' }}
    />
  </>
);

const Filter = styled(Autocomplete<TagOption, true, false, false>)`
  background: ${p => p.theme.pageBackground};
  padding: 0.7rem 1rem 0.5rem 1rem;
  flex: 1 0 0;
  margin-right: 0.5rem;

  .MuiInput-underline:before {
    content: none;
  }

  .MuiInput-underline:after {
    content: none;
  }

  .MuiChip-colorSecondary {
    background-color: red;
  }
`;

export default TagFilter;
