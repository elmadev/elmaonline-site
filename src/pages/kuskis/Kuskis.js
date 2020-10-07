import React, { useState, useEffect } from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';

import Link from 'components/Link';
import Kuski from 'components/Kuski';

import { useStoreState, useStoreActions } from 'easy-peasy';
import s from './Kuskis.css';

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

const Kuskis = () => {
  const { playerList } = useStoreState(state => state.Kuskis);
  const { getPlayers } = useStoreActions(actions => actions.Kuskis);

  const [filter, setFilter] = useState('');
  const [expanded, setExpanded] = useState([]);

  useEffect(() => {
    getPlayers();
  }, []);

  if (!playerList) {
    return null;
  }

  const toggleGroup = c => {
    setExpanded(prevExpanded => {
      return prevExpanded.includes(c) ? [] : [c];
    });
  };

  const filteredKuskis = playerList.filter(
    k =>
      filter.length < 1 ||
      k.Kuski.toLowerCase().includes(filter.toLocaleLowerCase()),
  );
  return (
    <div className={s.kuskis}>
      <div className={s.filter}>
        <input
          type="text"
          value={filter}
          onChange={e => {
            setFilter(e.target.value);
          }}
          placeholder="Filter"
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
                onClick={() => toggleGroup(g)}
                onKeyDown={() => toggleGroup(g)}
                role="button"
                tabIndex="0"
              >
                <span className={s.groupChar}>
                  {Array.isArray(g) ? '…' : g}
                </span>
                <span className={s.groupItemCount}>{kuskis.length}</span>
              </div>
              {(filter.length > 0 || expanded.includes(g)) && (
                <div className={s.groupContent}>
                  {kuskis.map(k => (
                    <Link
                      to={`/kuskis/${k.Kuski}`}
                      className={s.kuskiRow}
                      key={k.KuskiIndex}
                    >
                      <Kuski kuskiData={k} flag team noLink />
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
};

export default withStyles(s)(Kuskis);
