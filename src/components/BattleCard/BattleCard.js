import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import { Kuski, Level, BattleType } from 'components/Names';
import LocalTime from 'components/LocalTime';

import s from './battleCard.css';

const BattleCard = props => {
  const { battle } = props;

  if (!battle) return null;

  return (
    <React.Fragment>
      <Typography variant="h3" gutterBottom>
        Current Battle
      </Typography>
      <Card className={s.card}>
        <CardContent>
          <Typography variant="h4">
            <Level index={battle.LevelIndex} />
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            <Level long index={battle.LevelIndex} />
          </Typography>
          <Typography
            className={s.info}
            variant="subtitle1"
            color="textSecondary"
          >
            <div>
              <span>Author: </span>
              <strong>
                <Kuski index={battle.KuskiIndex} />
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
                <LocalTime date={battle.Started} format="HH:mm:ss" parse="X" />
              </strong>
            </div>
          </Typography>
        </CardContent>
        {/* TODO: replace with proper solution for level images */}
        <img
          className={s.cover}
          src={`https://elmaonline.net/images/map/${battle.LevelIndex}/150/150`}
          alt="Elmaonline battle"
        />
      </Card>
    </React.Fragment>
  );
};

BattleCard.propTypes = {
  battle: PropTypes.isRequired,
};

export default withStyles(s)(BattleCard);
