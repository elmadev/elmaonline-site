import React from 'react';
import { format } from 'date-fns';
import styled from '@emotion/styled';
import { Tabs, Tab, Grid } from '@material-ui/core';
import Layout from 'components/Layout';
import Header from 'components/Header';
import RankingTable from 'features/RankingTable';
import { Paper, Content } from 'components/Paper';
import { BATTLETYPES, BATTLETYPES_LONG } from 'constants/ranking';
import Selector from 'components/Selector';

export const formatPeriod = (type, year, month, week, day) => {
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

const periodTypes = ['all', 'year', 'month', 'week', 'day'];

const years = [];
const maxYear = parseInt(format(new Date(), 'y'), 10);
for (let y = 2010; y <= maxYear; y += 1) {
  years.push({ id: y, name: y });
}

const months = [
  { id: 1, name: 'January' },
  { id: 2, name: 'February' },
  { id: 3, name: 'March' },
  { id: 4, name: 'April' },
  { id: 5, name: 'May' },
  { id: 6, name: 'June' },
  { id: 7, name: 'July' },
  { id: 8, name: 'August' },
  { id: 9, name: 'September' },
  { id: 10, name: 'October' },
  { id: 11, name: 'November' },
  { id: 12, name: 'December' },
];

const weeks = [];
for (let y = 1; y <= 52; y += 1) {
  weeks.push({ id: y, name: y });
}

const days = [];
for (let y = 1; y <= 31; y += 1) {
  days.push({ id: y, name: y });
}

const mins = [
  { id: 0, name: 0 },
  { id: 1, name: 1 },
  { id: 2, name: 2 },
  { id: 5, name: 5 },
  { id: 10, name: 10 },
  { id: 25, name: 25 },
  { id: 50, name: 50 },
  { id: 100, name: 100 },
];

class Ranking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 0,
      year: maxYear,
      month: parseInt(format(new Date(), 'M'), 10),
      week: parseInt(format(new Date(), 'w'), 10),
      day: parseInt(format(new Date(), 'd'), 10),
      battleType: 'All',
      min: 10,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { tab } = this.state;
    if (tab !== prevState.tab) {
      this.setState({ min: defaultMinPlayed[tab] });
    }
  }

  render() {
    const { tab, year, month, week, day, battleType, min } = this.state;
    const battleTypes = [];
    BATTLETYPES[periodTypes[tab]].forEach(bt => {
      battleTypes.push({ id: bt, name: BATTLETYPES_LONG[bt] });
    });
    return (
      <Layout edge t="Ranking">
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
              <Paper>
                <Content>
                  <Header>Ranking</Header>
                </Content>
                {tab === 0 && (
                  <RankingTable
                    battleType={battleType}
                    minPlayed={min}
                    tableIndex="RankingIndex"
                    periodType="overall"
                    period="overall"
                  />
                )}
                {tab === 1 && (
                  <RankingTable
                    battleType={battleType}
                    minPlayed={min}
                    tableIndex="RankingYearlyIndex"
                    periodType="year"
                    period={year}
                  />
                )}
                {tab === 2 && (
                  <RankingTable
                    battleType={battleType}
                    minPlayed={min}
                    tableIndex="RankingMonthlyIndex"
                    periodType="month"
                    period={formatPeriod('month', year, month, week, day)}
                  />
                )}
                {tab === 3 && (
                  <RankingTable
                    battleType={battleType}
                    minPlayed={min}
                    tableIndex="RankingWeeklyIndex"
                    periodType="week"
                    period={formatPeriod('week', year, month, week, day)}
                  />
                )}
                {tab === 4 && (
                  <RankingTable
                    battleType={battleType}
                    minPlayed={min}
                    tableIndex="RankingDailyIndex"
                    periodType="day"
                    period={formatPeriod('day', year, month, week, day)}
                  />
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper padding>
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
                    <Selector
                      label="Year"
                      options={years}
                      selected={year}
                      onChange={newYear => this.setState({ year: newYear })}
                    />
                  )}
                  {(tab === 2 || tab === 4) && (
                    <Selector
                      label="Month"
                      options={months}
                      selected={month}
                      onChange={newMonth => this.setState({ month: newMonth })}
                    />
                  )}
                  {tab === 3 && (
                    <Selector
                      label="Week"
                      options={weeks}
                      selected={week}
                      onChange={newWeek => this.setState({ week: newWeek })}
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
                    <Selector
                      label="Day"
                      options={days}
                      selected={day}
                      onChange={newDay => this.setState({ day: newDay })}
                    />
                  )}
                  <Selector
                    label="Battle Type"
                    options={battleTypes}
                    selected={battleType}
                    onChange={type => this.setState({ battleType: type })}
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
                  <Selector
                    label="Min. played"
                    options={mins}
                    selected={min}
                    onChange={newMin => this.setState({ min: newMin })}
                  />
                </div>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Layout>
    );
  }
}

const Container = styled.div`
  padding-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
`;

export default Ranking;
