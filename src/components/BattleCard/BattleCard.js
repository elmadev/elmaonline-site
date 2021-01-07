import React from 'react';
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

const BattleCard = props => {
  const { battle } = props;

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
  battle: PropTypes.shape().isRequired,
};

export default BattleCard;
