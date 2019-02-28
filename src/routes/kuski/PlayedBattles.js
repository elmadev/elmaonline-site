import React from 'react';
import { graphql, compose } from 'react-apollo';
import TablePagination from '@material-ui/core/TablePagination';
import PropTypes from 'prop-types';
import Time from '../../components/Time';
import Link from '../../components/Link';
import LocalTime from '../../components/LocalTime';
import battlesQuery from './battles.graphql';

class PlayedBattles extends React.Component {
  render() {
    if (!this.props.data.getBattlesByKuski) return null;
    return (
      <React.Fragment>
        {this.props.data.getBattlesByKuski.rows.map(b => (
          <Link to={`/battles/${b.BattleIndex}`} key={b.BattleIndex}>
            <span>{b.LevelData && b.LevelData.LevelName}</span>
            <span>
              {b.KuskiData.Kuski}{' '}
              {b.KuskiData.TeamData && `[${b.KuskiData.TeamData.Team}]`}
            </span>
            <span>
              {b.Results.length > 0 ? b.Results[0].KuskiData.Kuski : null}{' '}
              {b.Results.length > 0 &&
                b.Results[0].KuskiData.TeamData &&
                `[${b.Results[0].KuskiData.TeamData.Team}]`}
            </span>
            <span>
              {b.Results.length > 0 ? <Time time={b.Results[0].Time} /> : null}
            </span>
            <span>
              {b.Results.findIndex(
                r => r.KuskiIndex === this.props.KuskiIndex,
              ) + 1}
            </span>
            <span>
              <LocalTime
                date={b.Started}
                format="DD.MM.YYYY HH:mm:ss"
                parse="X"
              />
            </span>
          </Link>
        ))}
        <TablePagination
          component="div"
          count={this.props.data.getBattlesByKuski.total}
          rowsPerPage={25}
          page={this.props.data.getBattlesByKuski.page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={(e, page) => {
            this.props.data.fetchMore({
              variables: {
                Page: page,
              },
              updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;
                return Object.assign({}, prev, {
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
      </React.Fragment>
    );
  }
}

PlayedBattles.propTypes = {
  data: PropTypes.shape.isRequired,
  KuskiIndex: PropTypes.number.isRequired,
};

export default compose(
  graphql(battlesQuery, {
    options: ownProps => ({
      variables: {
        KuskiIndex: ownProps.KuskiIndex,
        Page: ownProps.Page || 0,
      },
    }),
  }),
)(PlayedBattles);
