import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import Kuski from 'components/Kuski';
import DerpTable from 'components/Table/DerpTable';
import { ListRow, ListCell } from 'styles/List';

import rankingQuery from './day.graphql';

class RankingMonth extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      refetch: PropTypes.func.isRequired,
    }).isRequired,
    battleType: PropTypes.string.isRequired,
    minPlayed: PropTypes.number,
  };

  static defaultProps = {
    minPlayed: 1,
  };

  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      rowsPerPage: 10,
    };
  }

  render() {
    const {
      battleType,
      minPlayed,
      data: { loading, getRankingDaily },
    } = this.props;
    const { page, rowsPerPage } = this.state;
    const Points = `Points${battleType}`;
    const Ranking = `Ranking${battleType}`;
    const Wins = `Wins${battleType}`;
    const Designed = `Designed${battleType}`;
    const Played = `Played${battleType}`;
    const FilteredRanking = getRankingDaily
      ? getRankingDaily.filter(r => r[Played] > minPlayed)
      : null;
    return (
      <>
        {FilteredRanking && (
          <DerpTable
            headers={[
              '#',
              'Player',
              'Ranking',
              'Points',
              'Wins',
              'Designed',
              'Played',
            ]}
            length={FilteredRanking.length}
            pagination
            loading={loading}
            onChangePage={nextPage => this.setState({ page: nextPage })}
            onChangeRowsPerPage={rows =>
              this.setState({
                page: 0,
                rowsPerPage: rows,
              })
            }
          >
            {FilteredRanking.sort((a, b) => {
              return b[Ranking] - a[Ranking];
            })
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((i, no) => {
                return (
                  <ListRow key={i.RankingDailyIndex}>
                    <ListCell>{no + 1 + page * rowsPerPage}.</ListCell>
                    <ListCell>
                      <Kuski kuskiData={i.KuskiData} team flag />
                    </ListCell>
                    <ListCell>{parseFloat(i[Ranking]).toFixed(2)}</ListCell>
                    <ListCell>{i[Points]}</ListCell>
                    <ListCell>{i[Wins]}</ListCell>
                    <ListCell>{i[Designed]}</ListCell>
                    <ListCell>{i[Played]}</ListCell>
                  </ListRow>
                );
              })}
          </DerpTable>
        )}
      </>
    );
  }
}

export default compose(
  graphql(rankingQuery, {
    options: ownProps => ({
      variables: {
        Period: ownProps.period,
      },
    }),
  }),
)(RankingMonth);
