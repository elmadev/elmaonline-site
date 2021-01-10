import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CardHeader,
} from '@material-ui/core';
import { Level, BattleType } from 'components/Names';
import Kuski from 'components/Kuski';
import Header from 'components/Header';
import LocalTime from 'components/LocalTime';
import LevelMap from 'components/LevelMap';
import styled from 'styled-components';
import { toLocalTime } from 'utils/time';
import m from 'moment';
import useInterval from '@use-it/interval';
import LinearProgressWithLabel from './LinearProgressWithLabel';

const BattleCard = props => {
  const { battle } = props;
  const [remainingPercent, setRemainingPercent] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const getStart = started => {
    return toLocalTime(started, 'X').format('X');
  };

  const getEnd = (started, duration) => {
    return toLocalTime(started, 'X')
      .add(duration, 'minutes')
      .format('X');
  };

  const getNow = () => {
    return m().format('X');
  };

  const getRemainingPercent = (started, duration) => {
    const now = getNow();
    const start = getStart(started);
    const end = getEnd(started, duration);

    if (start > now) {
      return 100;
    }

    if (end < now) {
      return 0;
    }

    return Math.round(((end - now) / (end - start)) * 100, 2);
  };

  const getRemainingSeconds = (started, duration) => {
    const seconds = getEnd(started, duration) - getNow();
    return seconds > 0 ? seconds : 0;
  };

  useInterval(() => {
    setRemainingPercent(() => {
      if (battle) {
        return getRemainingPercent(battle.Started, battle.Duration);
      }
      return 0;
    });
    setRemainingSeconds(() => {
      if (battle) {
        return getRemainingSeconds(battle.Started, battle.Duration);
      }
      return 0;
    });
  }, 1000);

  if (!battle) return null;

  return (
    <CardFlex>
      <Grid container spacing={0}>
        <Grid item xs={12} md={6}>
          <CardHeader title="Current Battle" />
          <CardContent>
            <Header h2 nomargin>
              <Level LevelData={battle.LevelData} />
            </Header>
            <Typography variant="body1" color="textSecondary">
              <Level long LevelData={battle.LevelData} />
            </Typography>
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
                <LocalTime date={battle.Started} format="HH:mm:ss" parse="X" />
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
  );
};

const CardFlex = styled(Card)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Text = styled.div`
  color: rgba(0, 0, 0, 0.54);
  font-size: 14px;
`;

BattleCard.propTypes = {
  battle: PropTypes.shape(),
};

BattleCard.defaultProps = {
  battle: null,
};

export default BattleCard;
