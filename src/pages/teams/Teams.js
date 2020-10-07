import React, { useState, useEffect } from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import { useStoreState, useStoreActions } from 'easy-peasy';
import Link from 'components/Link';

import s from './Teams.css';

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

const Teams = () => {
  const [filter, setFilter] = useState('');
  const [expanded, setExpanded] = useState([]);
  const { teams } = useStoreState(state => state.Teams);
  const { getTeams } = useStoreActions(actions => actions.Teams);

  useEffect(() => {
    getTeams();
  }, []);

  const toggleGroup = c => {
    const newExpanded = [...expanded];
    const i = newExpanded.findIndex(item => item === c);
    if (i < 0) {
      newExpanded.push(c);
    } else {
      newExpanded.splice(i, 1);
    }
    setExpanded(newExpanded);
  };

  if (!teams) return null;
  if (teams.length <= 0) return null;

  const filteredTeams = teams.filter(
    k =>
      filter.length < 1 ||
      k.Team.toLowerCase().includes(filter.toLocaleLowerCase()),
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
          const letterTeams = filteredTeams.filter(k =>
            Array.isArray(g)
              ? g.includes(k.Team[0].toLowerCase())
              : g === k.Team[0].toLowerCase(),
          );
          if (letterTeams.length < 1) return null;
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
                <span className={s.groupItemCount}>{letterTeams.length}</span>
              </div>
              {(filter.length > 0 || expanded.includes(g)) && (
                <div className={s.groupContent}>
                  {letterTeams.map(k => (
                    <Link
                      to={`/team/${k.Team}`}
                      className={s.kuskiRow}
                      key={k.TeamIndex}
                    >
                      {k.Team}
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

export default withStyles(s)(Teams);
