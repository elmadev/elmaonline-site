import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Grid } from '@material-ui/core';
import { Level, BattleType } from 'components/Names';
import Kuski from 'components/Kuski';
import Header from 'components/Header';
import LocalTime from 'components/LocalTime';
import LevelMap from 'features/LevelMap';
import styled from '@emotion/styled';
import { toLocalTime } from 'utils/time';
import { format, addMinutes } from 'date-fns';
import { useInterval } from 'utils/useInterval';
import LinearProgressWithLabel from 'components/LinearProgressWithLabel';

const BattleCard = ({ battle = null }) => {
  const [remainingPercent, setRemainingPercent] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const getStart = started => {
    return format(toLocalTime(started, 't'), 't');
  };

  const getEnd = (started, duration) => {
    return format(addMinutes(toLocalTime(started, 't'), duration), 't');
  };

  const getNow = () => {
    return format(new Date(), 't');
  };

  const getRemainingPercent = (started, duration, countdown) => {
    const now = getNow();
    const start = getStart(parseInt(started) + countdown);
    const end = getEnd(parseInt(started) + countdown, duration);

    if (start > now) {
      return 100;
    }

    if (end < now) {
      return 0;
    }

    return Math.round(((end - now) / (end - start)) * 100, 2);
  };

  const getRemainingSeconds = (started, duration, countdown) => {
    const seconds = getEnd(parseInt(started) + countdown, duration) - getNow();
    return seconds > 0 ? seconds : 0;
  };

  useInterval(() => {
    setRemainingPercent(() => {
      if (battle) {
        return getRemainingPercent(
          battle.Started,
          battle.Duration,
          battle.Countdown,
        );
      }
      return 0;
    });
    setRemainingSeconds(() => {
      if (battle) {
        return getRemainingSeconds(
          battle.Started,
          battle.Duration,
          battle.Countdown,
        );
      }
      return 0;
    });
  }, 1000);

  if (!battle) return null;

  return (
    <Grid item xs={12}>
      <CardFlex>
        <Grid container spacing={0}>
          <Grid item xs={12} md={6}>
            <CardContent>
              <Header h2>Current Battle</Header>
              <Header h3 nomargin>
                <Level LevelData={battle.LevelData} noLink />
              </Header>
              <Header h3>
                <Level long LevelData={battle.LevelData} noLink />
              </Header>
              <Text>
                <span>Designer: </span>
                <strong>
                  <Kuski kuskiData={battle.KuskiData} />
                </strong>
              </Text>
              <Text>
                <span>Type: </span>
                <strong>
                  <BattleType type={battle.BattleType} />
                </strong>
              </Text>
              <Text>
                <span>Duration: </span>
                <strong>{battle.Duration} mins</strong>
              </Text>
              <Text>
                <span>Started: </span>
                <strong>
                  <LocalTime
                    date={battle.Started}
                    format="HH:mm:ss"
                    parse="t"
                  />
                </strong>
              </Text>
              <LinearProgressWithLabel
                value={remainingPercent}
                remainingSeconds={remainingSeconds}
              />
            </CardContent>
          </Grid>
          <Grid item xs={12} md={6}>
            <LevelMap LevelIndex={battle.LevelIndex} />
          </Grid>
        </Grid>
      </CardFlex>
    </Grid>
  );
};

const CardFlex = styled(Card)`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const Text = styled.div`
  color: ${p => p.theme.lightTextColor};
  font-size: 14px;
`;

BattleCard.propTypes = {
  battle: PropTypes.shape(),
};

export default BattleCard;
