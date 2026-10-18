import Chip from '@mui/material/Chip';
import styled from '@emotion/styled';

const colors: Record<string, string> = {
  // replay +- level/levelpack:
  TAS: 'red',
  DNF: 'gray',
  Bug: 'brown',
  Nitro: 'blue',
  Unlisted: 'gray',
  // lgr:
  'Alt Palette': 'red',
  Default: 'blue',
  Theme: 'purple',
};

const StyledTag = styled(Chip)`
  &.MuiChip-root {
    ${p => typeof p.label === 'string' && `color: ${colors[p.label]}`};
    ${p => typeof p.label === 'string' && `border-color: ${colors[p.label]}`};
  }
`;

type TagProps = {
  tag: string;
};

const Tag = ({ tag }: TagProps) => (
  <StyledTag size="small" label={tag} variant="outlined" />
);

export default Tag;
