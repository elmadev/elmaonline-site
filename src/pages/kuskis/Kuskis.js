import React from 'react';
import { graphql, compose } from 'react-apollo';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';

import Link from 'components/Link';
import Kuski from 'components/Kuski';

import s from './Kuskis.css';
import kuskiQuery from './kuskis.graphql';

const groups = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '_'],
];

class Kuskis extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: '',
      expanded: [],
    };
  }

  toggleGroup = c => {
    this.setState(prevState => {
      const { expanded } = prevState;

      const i = expanded.findIndex(item => item === c);
      if (i < 0) expanded.push(c);
      else expanded.splice(i, 1);
      return {
        expanded,
      };
    });
  };

  render() {
    const {
      data: { loading, getKuskis },
    } = this.props;

    if (loading) return null;
    const filteredKuskis = getKuskis.filter(
      k =>
        this.state.filter.length < 1 ||
        k.Kuski.toLowerCase().includes(this.state.filter.toLocaleLowerCase()),
    );
    return (
      <div className={s.kuskis}>
        <div className={s.filter}>
          <input
            type="text"
            value={this.state.filter}
            onChange={e => {
              this.setState({
                filter: e.target.value,
              });
            }}
            placeholder="Search"
          />
        </div>
        <div className={s.kuskiList}>
          {groups.map(g => {
            const kuskis = filteredKuskis.filter(k =>
              Array.isArray(g)
                ? g.includes(k.Kuski[0].toLowerCase())
                : g === k.Kuski[0].toLowerCase(),
            );
            if (kuskis.length < 1) return null;
            return (
              <div key={g}>
                <div
                  className={s.groupTitle}
                  onClick={() => this.toggleGroup(g)}
                  onKeyDown={() => this.toggleGroup(g)}
                  role="button"
                  tabIndex="0"
                >
                  <span className={s.groupChar}>
                    {Array.isArray(g) ? '…' : g}
                  </span>
                  <span className={s.groupItemCount}>{kuskis.length}</span>
                </div>
                {(this.state.filter.length > 0 ||
                  this.state.expanded.includes(g)) && (
                  <div className={s.groupContent}>
                    {kuskis.map(k => (
                      <Link
                        to={`/kuskis/${k.Kuski}`}
                        className={s.kuskiRow}
                        key={k.KuskiIndex}
                      >
                        <Kuski kuskiData={k} flag team />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

Kuskis.propTypes = {
  data: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    getKuskis: PropTypes.array,
  }).isRequired,
};

export default compose(
  withStyles(s),
  graphql(kuskiQuery),
)(Kuskis);
