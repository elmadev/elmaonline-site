import { useEffect, useState } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import { Column } from 'components/Containers';
import styled from '@emotion/styled';
import { Text } from 'components/Containers';
import { formattedTime } from 'utils/time';

function perc2color(perc: number) {
  let r;
  let g;
  const b = 0;
  if (perc < 50) {
    r = 255;
    g = Math.round(5.1 * perc);
  } else {
    g = 255;
    r = Math.round(510 - 5.1 * perc);
  }
  const h = r * 0x10000 + g * 0x100 + b * 0x1;
  return `#${`000000${h.toString(16)}`.slice(-6)}`;
}

const StyledLinearProgress = styled(LinearProgress, {
  shouldForwardProp: prop => prop !== 'lineColor',
})<{ lineColor: string }>`
  &.MuiLinearProgress-colorPrimary {
    background-color: #f1f1f1;

    .MuiLinearProgress-barColorPrimary {
      background-color: ${p => p.lineColor};
    }
  }
`;

type LinearProgressWithLabelProps = {
  value: number;
  remainingSeconds: number;
};

export default function LinearProgressWithLabel({
  value,
  remainingSeconds,
}: LinearProgressWithLabelProps) {
  const [lineColor, setLineColor] = useState(perc2color(value));

  useEffect(() => {
    setLineColor(perc2color(value));
  }, [value]);

  return (
    <div style={{ width: '100%' }}>
      <Column ai="center">
        <div style={{ width: '100%', paddingBottom: '8px', paddingTop: '8px' }}>
          <StyledLinearProgress
            value={value}
            variant="determinate"
            lineColor={lineColor}
          />
        </div>
        <Text light>{formattedTime(remainingSeconds)} left</Text>
      </Column>
    </div>
  );
}
