import React from 'react';
import styled from '@emotion/styled';
import { isEmpty } from 'lodash';
import { formatAttempts, formatTimeSpent, formatPct } from '../../utils/format';
import {
  ListContainer,
  ListRow,
  ListHeader,
  ListCell,
} from '../../components/List';

const LevelInfoLevelStats = ({ level }) => {
  const stats = isEmpty(level) ? undefined : level?.LevelStatsData;

  if (isEmpty(stats)) {
    return <div>&nbsp;&nbsp;&nbsp;Not available.</div>;
  }

  return (
    <Root>
      <ListContainer>
        <ListHeader>
          <ListCell>Type</ListCell>
          <ListCell>Finished %</ListCell>
          <ListCell>Dead %</ListCell>
          <ListCell>Escaped %</ListCell>
          <ListCell>Total</ListCell>
        </ListHeader>
        <ListRow>
          <ListCell>Kuskis Played</ListCell>
          <ListCell title={formatAttempts(stats.KuskiCountF)}>
            {formatPct(stats.KuskiCountF, stats.KuskiCountAll, 1)}
          </ListCell>
          <ListCell>-</ListCell>
          <ListCell>-</ListCell>
          <ListCell>{formatAttempts(stats.KuskiCountAll)}</ListCell>
        </ListRow>
        <ListRow>
          <ListCell>Total Runs</ListCell>
          <ListCell title={formatAttempts(stats.AttemptsF)}>
            {formatPct(stats.AttemptsF, stats.AttemptsAll, 1)}
          </ListCell>
          <ListCell title={formatAttempts(stats.AttemptsD)}>
            {formatPct(stats.AttemptsD, stats.AttemptsAll, 1)}
          </ListCell>
          <ListCell title={formatAttempts(stats.AttemptsE)}>
            {formatPct(stats.AttemptsE, stats.AttemptsAll, 1)}
          </ListCell>
          <ListCell>{formatAttempts(stats.AttemptsAll)}</ListCell>
        </ListRow>
        <ListRow>
          <ListCell>Total Playtime</ListCell>
          <ListCell title={formatTimeSpent(stats.TimeF)}>
            {formatPct(stats.TimeF, stats.TimeAll, 1)}
          </ListCell>
          <ListCell title={formatTimeSpent(stats.TimeD)}>
            {formatPct(stats.TimeD, stats.TimeAll, 1)}
          </ListCell>
          <ListCell title={formatTimeSpent(stats.TimeE)}>
            {formatPct(stats.TimeE, stats.TimeAll, 1)}
          </ListCell>
          <ListCell>{formatTimeSpent(stats.TimeAll)}</ListCell>
        </ListRow>
      </ListContainer>
    </Root>
  );
};

const Root = styled.div`
  width: 100%;
`;

export default LevelInfoLevelStats;
