import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useStoreState, useStoreActions } from 'easy-peasy';
import Link from 'components/Link';

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
    <Container>
      <Filter>
        <input
          type="text"
          value={filter}
          onChange={e => {
            setFilter(e.target.value);
          }}
          placeholder="Filter"
        />
      </Filter>
      <KuskiList>
        {groups.map(g => {
          const letterTeams = filteredTeams.filter(k =>
            Array.isArray(g)
              ? g.includes(k.Team[0].toLowerCase())
              : g === k.Team[0].toLowerCase(),
          );
          if (letterTeams.length < 1) return null;
          return (
            <div key={g}>
              <GroupTitle
                onClick={() => toggleGroup(g)}
                onKeyDown={() => toggleGroup(g)}
                role="button"
                tabIndex="0"
              >
                <GroupChar>{Array.isArray(g) ? '…' : g}</GroupChar>
                <GroupItemCount>{letterTeams.length}</GroupItemCount>
              </GroupTitle>
              {(filter.length > 0 || expanded.includes(g)) && (
                <GroupContent>
                  {letterTeams.map(k => (
                    <KuskiRow to={`/team/${k.Team}`} key={k.TeamIndex}>
                      {k.Team}
                    </KuskiRow>
                  ))}
                </GroupContent>
              )}
            </div>
          );
        })}
      </KuskiList>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100%;
  background: #fff;
  padding-bottom: 200px;
  a {
    color: #000;
    border-bottom: 1px solid #eaeaea;
    font-size: 14px;
    display: block;
    :hover {
      background: #f9f9f9;
    }
    span {
      margin-right: 10px;
    }
  }
`;

const GroupTitle = styled.div`
  padding: 10px;
  padding-top: 20px;
  font-weight: 500;
  border-bottom: 1px solid #eaeaea;
  outline: 0;
  cursor: pointer;
`;

const GroupItemCount = styled.span`
  font-size: 12px;
  color: #909090;
  font-weight: normal;
`;

const GroupChar = styled.span`
  display: inline-block;
  min-width: 20px;
  margin-right: 10px;
  text-transform: uppercase;
`;

const GroupContent = styled.div`
  display: block;
`;

const KuskiRow = styled(Link)`
  padding: 10px;
`;

const Filter = styled.div`
  background: #f1f1f1;
  position: fixed;
  width: 100%;
  z-index: 5;
  input {
    padding: 15px 10px;
    font-size: 14px;
    border: 0;
    background: transparent;
    outline: 0;
    width: 100%;
    max-width: 500px;
    display: block;
    box-sizing: border-box;
  }
`;

const KuskiList = styled.div`
  padding-top: 46px;
`;

export default Teams;
