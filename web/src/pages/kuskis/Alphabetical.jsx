import React, { useState } from 'react';
import { useDebounce } from 'use-debounce';
import styled from '@emotion/styled';
import Link from 'components/Link';
import Kuski from 'components/Kuski';
import Loading from 'components/Loading';

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

const Kuskis = ({ playerList }) => {
  const [text, setText] = useState('');
  const [filter] = useDebounce(text, 500);
  const [expanded, setExpanded] = useState([]);

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
    <div>
      {!playerList ? (
        <Loading />
      ) : (
        <KuskisContainer>
          <Filter>
            <input
              type="text"
              value={text}
              onChange={e => {
                setText(e.target.value);
              }}
              placeholder="Filter"
            />
          </Filter>
          <KuskiList>
            {groups.map(g => {
              const kuskis = filteredKuskis.filter(k =>
                Array.isArray(g)
                  ? g.includes(k.Kuski[0].toLowerCase())
                  : g === k.Kuski[0].toLowerCase(),
              );
              if (kuskis.length < 1) return null;
              return (
                <div key={g}>
                  <GroupTitle
                    onClick={() => toggleGroup(g)}
                    onKeyDown={() => toggleGroup(g)}
                    role="button"
                    tabIndex="0"
                  >
                    <GroupChar>{Array.isArray(g) ? '…' : g}</GroupChar>
                    <GroupItemCount>{kuskis.length}</GroupItemCount>
                  </GroupTitle>
                  {(filter.length > 0 || expanded.includes(g)) && (
                    <GroupContent>
                      {kuskis.map(k => (
                        <KuskiRow to={`/kuskis/${k.Kuski}`} key={k.KuskiIndex}>
                          <Kuski kuskiData={k} flag team noLink />
                        </KuskiRow>
                      ))}
                    </GroupContent>
                  )}
                </div>
              );
            })}
          </KuskiList>
        </KuskisContainer>
      )}
    </div>
  );
};

const KuskisContainer = styled.div`
  min-height: 100%;
  background: ${p => p.theme.paperBackground};
  padding-bottom: 200px;

  a {
    color: ${p => p.theme.fontColor};
    border-bottom: 1px solid #eaeaea;
    font-size: 14px;
    display: block;

    &:hover {
      background: ${p => p.theme.hoverColor};
    }
  }
`;

const GroupContent = styled.div`
  display: block;
`;

const Filter = styled.div`
  background: ${p => p.theme.pageBackground};
  position: fixed;
  width: 100%;
  z-index: 5;

  input {
    color: ${p => p.theme.fontColor};
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

const KuskiRow = styled(Link)`
  padding: 10px;
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

export default Kuskis;
