import React from 'react';
import m from 'moment';
import styled from 'styled-components';
import { Tabs, Tab, Grid } from '@material-ui/core';

import Header from 'components/Header';
import RankingTable from 'components/RankingTable';
import {
  Year,
  Month,
  Week,
  Day,
  BattleTypes,
  MinPlayed,
} from 'components/Selectors';

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
        <Container>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={8}>
              <Header>Ranking</Header>
              {tab === 0 && (
                <RankingTable
                  battleType={battleType}
                  minPlayed={min}
                  index="RankingIndex"
                  periodType="overall"
                  period="overall"
                />
              )}
              {tab === 1 && (
                <RankingTable
                  battleType={battleType}
                  minPlayed={min}
                  index="RankingYearlyIndex"
                  periodType="year"
                  period={year}
                />
              )}
              {tab === 2 && (
                <RankingTable
                  battleType={battleType}
                  minPlayed={min}
                  index="RankingMonthlyIndex"
                  periodType="month"
                  period={formatPeriod('month', year, month, week, day)}
                />
              )}
              {tab === 3 && (
                <RankingTable
                  battleType={battleType}
                  minPlayed={min}
                  index="RankingWeeklyIndex"
                  periodType="week"
                  period={formatPeriod('week', year, month, week, day)}
                />
              )}
              {tab === 4 && (
                <RankingTable
                  battleType={battleType}
                  minPlayed={min}
                  index="RankingDailyIndex"
                  periodType="day"
                  period={formatPeriod('day', year, month, week, day)}
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
        </Container>
      </>
    );
  }
}

const Container = styled.div`
  padding-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
`;

export default Ranking;
