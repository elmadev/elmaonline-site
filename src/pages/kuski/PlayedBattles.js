import React from 'react';
import { graphql, compose } from 'react-apollo';
import TablePagination from '@material-ui/core/TablePagination';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';

import Time from 'components/Time';
import Link from 'components/Link';
import Kuski from 'components/Kuski';
import LocalTime from 'components/LocalTime';
import { BattleType } from 'components/Names';
import { sortResults } from 'utils/battle';

import battlesQuery from './battles.graphql';
import s from './PlayedBattles.css';

class PlayedBattles extends React.Component {
  render() {
    const {
      data: { getBattlesByKuski },
      data,
      KuskiIndex,
    } = this.props;
    if (!getBattlesByKuski) return null;
    return (
      <>
        <div className={s.recentBattlesHead}>
          <span className={s.type}>Type</span>
          <span className={s.designer}>Designer</span>
          <span className={s.filename}>Level</span>
          <span className={s.winnerKuski}>Winner</span>
          <span className={s.winnerTime}>Time</span>
          <span className={s.placement}>#</span>
          <span className={s.started}>Started</span>
        </div>
        {getBattlesByKuski.rows.map(b => {
          const sorted = [...b.Results].sort(sortResults(b.BattleType));
          return (
            <Link to={`/battles/${b.BattleIndex}`} key={b.BattleIndex}>
              <span className={s.type}>
                {b.Duration} min <BattleType type={b.BattleType} />
              </span>
              <span className={s.designer}>
                <Kuski kuskiData={b.KuskiData} flag team />
              </span>
              <span className={s.filename}>
                {b.LevelData && b.LevelData.LevelName}
              </span>
              <span className={s.winnerKuski}>
                {b.Results.length > 0 && (
                  <Kuski kuskiData={sorted[0].KuskiData} flag team />
                )}
              </span>
              <span className={s.winnerTime}>
                {b.Results.length > 0 ? (
                  <Time time={sorted[0].Time} apples={sorted[0].Apples} />
                ) : null}
              </span>
              <span className={s.placement}>
                {b.Results.findIndex(r => r.KuskiIndex === KuskiIndex) + 1}
              </span>
              <span className={s.started}>
                <LocalTime
                  date={b.Started}
                  format="DD.MM.YYYY HH:mm"
                  parse="X"
                />
              </span>
            </Link>
          );
        })}
        <TablePagination
          component="div"
          count={getBattlesByKuski.total}
          rowsPerPage={25}
          page={getBattlesByKuski.page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={(e, page) => {
            data.fetchMore({
              variables: {
                Page: page,
              },
              updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;
                return Object.assign({}, prev, { // eslint-disable-line
                  getBattlesByKuski: {
                    __typename: prev.getBattlesByKuski.__typename,
                    total: fetchMoreResult.getBattlesByKuski.total,
                    page: fetchMoreResult.getBattlesByKuski.page,
                    rows: [...fetchMoreResult.getBattlesByKuski.rows],
                  },
                });
              },
            });
          }}
          rowsPerPageOptions={[]}
        />
      </>
    );
  }
}

PlayedBattles.propTypes = {
  data: PropTypes.shape({
    getBattlesByKuski: PropTypes.shape({
      rows: PropTypes.array,
      total: PropTypes.number,
      page: PropTypes.number,
    }),
    fetchMore: PropTypes.func,
  }).isRequired,
  KuskiIndex: PropTypes.number.isRequired,
};

export default compose(
  withStyles(s),
  graphql(battlesQuery, {
    options: ownProps => ({
      variables: {
        KuskiIndex: ownProps.KuskiIndex,
        Page: ownProps.Page || 0,
      },
    }),
  }),
)(PlayedBattles);
