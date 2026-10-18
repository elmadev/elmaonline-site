import { FormControlLabel, Checkbox } from '@mui/material';
import styled from '@emotion/styled';

type Size = 'small' | 'medium';

type FieldBooleanProps = {
  onChange?: () => void;
  value: boolean;
  label: React.ReactNode;
  size?: Size;
};

export default function FieldBoolean({
  onChange,
  value,
  label,
  size = 'medium',
}: FieldBooleanProps) {
  return (
    <div>
      <StyledFormControlLabel
        fieldSize={size}
        control={
          <Checkbox
            size={size}
            checked={value}
            onChange={() => onChange && onChange()}
          />
        }
        label={label}
      />
    </div>
  );
}

const StyledFormControlLabel = styled(FormControlLabel, {
  shouldForwardProp: prop => prop !== 'fieldSize',
})<{ fieldSize: Size }>`
  span {
    font-size: ${p => (p.fieldSize === 'small' ? '14px' : 'initial')};
  }
`;
