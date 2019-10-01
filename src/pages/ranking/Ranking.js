import React from 'react';
import { compose } from 'react-apollo';
import m from 'moment';
import withStyles from 'isomorphic-style-loader/withStyles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import RankingOverall from 'components/RankingTable/Overall';
import RankingYear from 'components/RankingTable/Year';
import RankingMonth from 'components/RankingTable/Month';
import RankingWeek from 'components/RankingTable/Week';
import RankingDay from 'components/RankingTable/Day';
import { Year, Month, Week, Day, BattleTypes } from 'components/Selectors';

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
    };
  }

  render() {
    const { tab, year, month, week, day, battleType } = this.state;
    return (
      <>
        <Tabs
          value={tab}
          onChange={(e, value) => this.setState({ tab: value })}
        >
          <Tab label="Overall" />
          <Tab label={`Yearly (${year})`} />
          <Tab label={`Monthly (${year}/${month})`} />
          <Tab label={`Weekly (${year}/${week})`} />
          <Tab label={`Daily (${year}/${month}/${day})`} />
        </Tabs>
        <div className={s.root}>
          <Grid container spacing={24}>
            <Grid item xs={12} sm={8}>
              <Typography variant="h3" gutterBottom>
                Ranking
              </Typography>
              {tab === 0 && <RankingOverall battleType={battleType} />}
              {tab === 1 && (
                <RankingYear period={year} battleType={battleType} />
              )}
              {tab === 2 && (
                <RankingMonth
                  period={formatPeriod('month', year, month, week, day)}
                  battleType={battleType}
                />
              )}
              {tab === 3 && (
                <RankingWeek
                  period={formatPeriod('week', year, month, week, day)}
                  battleType={battleType}
                />
              )}
              {tab === 4 && (
                <RankingDay
                  period={formatPeriod('day', year, month, week, day)}
                  battleType={battleType}
                />
              )}
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h3" gutterBottom>
                Filter
              </Typography>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
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
                {tab === 4 && (
                  <Day dayUpdated={newDay => this.setState({ day: newDay })} />
                )}
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}
              >
                <BattleTypes
                  periodType={tab}
                  typeUpdated={type => this.setState({ battleType: type })}
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
