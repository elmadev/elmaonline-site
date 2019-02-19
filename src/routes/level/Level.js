import React from 'react';
import { graphql, compose } from 'react-apollo';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import query from './level.graphql';
import allTimesQuery from './allTimes.graphql';
import s from './Level.css';
import Recplayer from '../../components/Recplayer';
import Loading from '../../components/Loading';
import Time from '../../components/Time';
import Kuski from '../../components/Names/Kuski';

const TimeTable = withStyles(s)(({ data }) => (
  <div className={s.tableContainer}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell
            style={{
              width: '1px',
            }}
          >
            #
          </TableCell>
          <TableCell
            style={{
              width: '6rem',
            }}
          >
            Kuski
          </TableCell>
          <TableCell>Time</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((t, i) => (
          <TableRow key={t.TimeIndex}>
            <TableCell>{i + 1}.</TableCell>
            <TableCell>
              <Kuski index={t.KuskiIndex} />
            </TableCell>
            <TableCell>
              <Time time={t.Time} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
));

TimeTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

const AllTimes = compose(
  withStyles(s),
  graphql(allTimesQuery, {
    options: ownProps => ({
      variables: {
        LevelIndex: ownProps.LevelIndex,
      },
    }),
  }),
)(props => {
  const { data: { getTimes, loading } } = props;
  return loading ? <Loading /> : <TimeTable data={getTimes} />;
});

class Level extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 0,
    };
  }
  onTabClick = (e, value) => {
    this.setState({
      tab: value,
    });
  };
  render() {
    const { data: { getBestTimes, getLevel, loading } } = this.props;
    return (
      <div className={s.level}>
        <Recplayer
          lev={`/dl/level/${this.props.LevelIndex}`}
          controls={false}
        />
        {loading && <Loading />}
        {!loading && (
          <React.Fragment>
            <h2>{`${getLevel.LevelName}.lev ${getLevel.LongName}`}</h2>
            <Tabs value={this.state.tab} onChange={this.onTabClick}>
              <Tab label="Best individual times" />
              <Tab label="All times" />
            </Tabs>
            {this.state.tab === 0 && <TimeTable data={getBestTimes} />}
            {this.state.tab === 1 && (
              <AllTimes LevelIndex={this.props.LevelIndex} />
            )}
          </React.Fragment>
        )}
      </div>
    );
  }
}

Level.propTypes = {
  LevelIndex: PropTypes.number.isRequired,
  data: PropTypes.shape({
    loading: PropTypes.bool,
    getTimes: PropTypes.array,
  }).isRequired,
};

export default compose(
  withStyles(s),
  graphql(query, {
    options: ownProps => ({
      variables: {
        LevelIndex: ownProps.LevelIndex,
      },
    }),
  }),
)(Level);
