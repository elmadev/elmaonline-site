import React from 'react';
import { compose } from 'react-apollo';
import m from 'moment';
import withStyles from 'isomorphic-style-loader/withStyles';
import { Tabs, Tab, Grid } from '@material-ui/core';

import Header from 'components/Header';
import RankingOverall from 'components/RankingTable/Overall';
import RankingYear from 'components/RankingTable/Year';
import RankingMonth from 'components/RankingTable/Month';
import RankingWeek from 'components/RankingTable/Week';
import RankingDay from 'components/RankingTable/Day';
import {
  Year,
  Month,
  Week,
  Day,
  BattleTypes,
  MinPlayed,
} from 'components/Selectors';

import s from './Ranking.css';

const formatPeriod = (type, year, month, week, day) => {
  const monthFixed = `0${month}`.slice(-2);
  const weekFixed = `0${week}`.slice(-2);
  const dayFixed = `0${day}`.slice(-2);
  if (type === 'month') {
    return parseInt(`${year}${monthFixed}`, 10);
  }
  if (type === 'week') {
    return parseInt(`${year}${weekFixed}`, 10);
  }
  if (type === 'day') {
    return parseInt(`${year}${monthFixed}${dayFixed}`, 10);
  }
  return year;
};

const defaultMinPlayed = [10, 10, 5, 2, 1];

class Ranking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 0,
      year: 2010,
      month: parseInt(m().format('M'), 10),
      week: parseInt(m().format('w'), 10),
      day: parseInt(m().format('D'), 10),
      battleType: 'All',
      min: 10,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { tab } = this.state;
    if (tab !== prevState.tab) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ min: defaultMinPlayed[tab] });
    }
  }

  render() {
    const { tab, year, month, week, day, battleType, min } = this.state;
    return (
      <>
        <Tabs
          value={tab}
          onChange={(e, value) => this.setState({ tab: value })}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Overall" />
          <Tab label={`Yearly (${year})`} />
          <Tab label={`Monthly (${year}/${month})`} />
          <Tab label={`Weekly (${year}/${week})`} />
          <Tab label={`Daily (${year}/${month}/${day})`} />
        </Tabs>
        <div className={s.root}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={8}>
              <Header>Ranking</Header>
              {tab === 0 && (
                <RankingOverall battleType={battleType} minPlayed={min} />
              )}
              {tab === 1 && (
                <RankingYear
                  period={year}
                  battleType={battleType}
                  minPlayed={min}
                />
              )}
              {tab === 2 && (
                <RankingMonth
                  period={formatPeriod('month', year, month, week, day)}
                  battleType={battleType}
                  minPlayed={min}
                />
              )}
              {tab === 3 && (
                <RankingWeek
                  period={formatPeriod('week', year, month, week, day)}
                  battleType={battleType}
                  minPlayed={min}
                />
              )}
              {tab === 4 && (
                <RankingDay
                  period={formatPeriod('day', year, month, week, day)}
                  battleType={battleType}
                  minPlayed={min}
                />
              )}
            </Grid>
            <Grid item xs={12} sm={4}>
              <Header h2>Filter</Header>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}
              >
                {tab > 0 && (
                  <Year
                    yearUpdated={newYear => this.setState({ year: newYear })}
                  />
                )}
                {(tab === 2 || tab === 4) && (
                  <Month
                    monthUpdated={newMonth =>
                      this.setState({ month: newMonth })
                    }
                  />
                )}
                {tab === 3 && (
                  <Week
                    weekUpdated={newWeek => this.setState({ week: newWeek })}
                  />
                )}
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}
              >
                {tab === 4 && (
                  <Day dayUpdated={newDay => this.setState({ day: newDay })} />
                )}
                <BattleTypes
                  periodType={tab}
                  typeUpdated={type => this.setState({ battleType: type })}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}
              >
                <MinPlayed
                  isUpdated={newMin => this.setState({ min: newMin })}
                  min={min}
                />
              </div>
            </Grid>
          </Grid>
        </div>
      </>
    );
  }
}

export default compose(withStyles(s))(Ranking);
