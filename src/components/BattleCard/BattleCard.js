import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Grid } from '@material-ui/core';
import { Level, BattleType } from 'components/Names';
import Kuski from 'components/Kuski';
import Header from 'components/Header';
import LocalTime from 'components/LocalTime';
import LevelMap from 'components/LevelMap';

import s from './battleCard.css';

const BattleCard = props => {
  const { battle } = props;

  if (!battle) return null;

  return (
    <>
      <Header h2>Current Battle</Header>
      <Card className={s.card}>
        <Grid container spacing={0}>
          <Grid item xs={12} md={6}>
            <CardContent>
              <Header h2 nomargin>
                <Level LevelData={battle.LevelData} />
              </Header>
              <Typography variant="body1" color="textSecondary">
                <Level long LevelData={battle.LevelData} />
              </Typography>
              <Typography
                className={s.info}
                variant="body1"
                color="textSecondary"
              >
                <div>
                  <span>Designer: </span>
                  <strong>
                    <Kuski kuskiData={battle.KuskiData} />
                  </strong>
                </div>
                <div>
                  <span>Type: </span>
                  <strong>
                    <BattleType type={battle.BattleType} />
                  </strong>
                </div>
                <div>
                  <span>Duration: </span>
                  <strong>{battle.Duration} mins</strong>
                </div>
                <div>
                  <span>Started: </span>
                  <strong>
                    <LocalTime
                      date={battle.Started}
                      format="HH:mm:ss"
                      parse="X"
                    />
                  </strong>
                </div>
              </Typography>
            </CardContent>
          </Grid>
          <Grid item xs={12} md={6}>
            <LevelMap LevelIndex={battle.LevelIndex} />
          </Grid>
        </Grid>
      </Card>
    </>
  );
};

BattleCard.propTypes = {
  battle: PropTypes.shape().isRequired,
};

export default withStyles(s)(BattleCard);
