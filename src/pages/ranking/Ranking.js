import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import m from 'moment';
import withStyles from 'isomorphic-style-loader/withStyles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import Kuski from 'components/Kuski';
import PaginationActions from 'components/Table/PaginationActions';
import { Year, Month, Week } from 'components/Selectors';

import rankingQuery from './ranking.graphql';
import s from './Ranking.css';

class Ranking extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      refetch: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      tab: 0,
      year: 2010,
      month: m().format('M'),
      week: m().format('w'),
      day: m().format('D'),
      page: 0,
      rowsPerPage: 10,
    };
  }

  render() {
    const {
      data: {
        loading,
        getKinglist,
        getKinglistYearly,
        getKinglistMonthly,
        getKinglistWeekly,
        getKinglistDaily,
      },
    } = this.props;
    const { tab, year, month, week, day, page, rowsPerPage } = this.state;
    let kinglist;
    if (tab === 0) {
      kinglist = getKinglist;
    }
    if (tab === 1) {
      kinglist = getKinglistYearly;
    }
    if (tab === 2) {
      kinglist = getKinglistMonthly;
    }
    if (tab === 3) {
      kinglist = getKinglistWeekly;
    }
    if (tab === 4) {
      kinglist = getKinglistDaily;
    }
    return (
      <React.Fragment>
        <Tabs
          value={tab}
          onChange={(e, value) => this.setState({ tab: value })}
        >
          <Tab label="Overall" />
          <Tab label={`Yearly ${year}`} />
          <Tab label={`Monthly ${month}`} />
          <Tab label={`Weekly ${week}`} />
          <Tab label={`Daily ${day}`} />
        </Tabs>
        <div className={s.root}>
          <Grid container spacing={24}>
            <Grid item xs={12} sm={8}>
              <Typography variant="h3" gutterBottom>
                Ranking
              </Typography>
              <Paper>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Player</TableCell>
                      <TableCell>Ranking</TableCell>
                      <TableCell>Points</TableCell>
                      <TableCell>Wins</TableCell>
                      <TableCell>Designed</TableCell>
                      <TableCell>Extra</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading && <CircularProgress />}
                    {!loading &&
                      kinglist
                        .sort((a, b) => {
                          return b.RankingNM - a.RankingNM;
                        })
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage,
                        )
                        .map((i, no) => {
                          return (
                            <TableRow
                              hover
                              key={
                                i.KinglistIndex
                                  ? i.KinglistIndex
                                  : i.KinglistYearlyIndex
                              }
                            >
                              <TableCell
                                style={{ padding: '4px 10px 4px 10px' }}
                              >
                                {no + 1 + page * rowsPerPage}.
                              </TableCell>
                              <TableCell
                                style={{ padding: '4px 10px 4px 10px' }}
                              >
                                <Kuski kuskiData={i.KuskiData} team flag />
                              </TableCell>
                              <TableCell
                                style={{ padding: '4px 10px 4px 10px' }}
                              >
                                {parseFloat(i.RankingNM).toFixed(2)}
                              </TableCell>
                              <TableCell
                                style={{ padding: '4px 10px 4px 10px' }}
                              >
                                {i.PointsNM}
                              </TableCell>
                              <TableCell
                                style={{ padding: '4px 10px 4px 10px' }}
                              >
                                {i.WinsNM}
                              </TableCell>
                              <TableCell
                                style={{ padding: '4px 10px 4px 10px' }}
                              >
                                {i.DesignedNM}
                              </TableCell>
                              <TableCell
                                style={{ padding: '4px 10px 4px 10px' }}
                              >
                                {i.Year ? i.Year : ''}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        rowsPerPageOptions={[10, 25, 50, 100]}
                        colSpan={7}
                        count={kinglist ? kinglist.length : 0}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={(e, nextPage) =>
                          this.setState({ page: nextPage })
                        }
                        onChangeRowsPerPage={e =>
                          this.setState({
                            page: 0,
                            rowsPerPage: e.target.value,
                          })
                        }
                        ActionsComponent={PaginationActions}
                      />
                    </TableRow>
                  </TableFooter>
                </Table>
              </Paper>
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
              </div>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default compose(
  withStyles(s),
  graphql(rankingQuery, {
    options: () => ({
      variables: {
        Year: parseInt(m().format('YYYY'), 10),
        Month: parseInt(`${m().format('YYYY')}${m().format('MM')}`, 10),
        Week: parseInt(`${m().format('YYYY')}${m().format('WW')}`, 10),
        Day: parseInt(
          `${m().format('YYYY')}${m().format('MM')}${m().format('DD')}`,
          10,
        ),
      },
    }),
  }),
)(Ranking);
