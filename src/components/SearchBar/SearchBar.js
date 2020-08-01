import React, { useState } from 'react';
import history from 'utils/history';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Info from '@material-ui/icons/Info';
import Drawer from '@material-ui/core/Drawer';

const SearchBar = () => {
  const [searchType, setType] = useState('');
  const [value, setValue] = useState('');
  const [info, openInfo] = useState(false);
  return (
    <Container>
      {searchType === '' ? (
        <TypesContainer>
          Search <Button onClick={() => setType('level')}>Level</Button>
          <Button onClick={() => setType('battle')}>Battle</Button>
          <Button onClick={() => setType('replay')}>Replay</Button>
          <Button onClick={() => setType('player')}>Player</Button>
          <Button onClick={() => setType('team')}>Team</Button>
        </TypesContainer>
      ) : (
        <>
          <SearchInput
            value={value}
            onChange={e => setValue(e.target.value)}
            autoFocus
            type="text"
            placeholder={`Search ${searchType}`}
            onKeyUp={e => {
              if (e.keyCode === 13) {
                if (e.target.value === '') {
                  setType('');
                } else {
                  history.push(`/search?q=${e.target.value}&t=${searchType}`);
                }
              }
              if (e.keyCode === 27) {
                setValue('');
                setType('');
              }
            }}
          />
          <OpenInfo onClick={() => openInfo(!info)}>
            <Info />
          </OpenInfo>
        </>
      )}
      <Drawer anchor="bottom" open={info} onClose={() => openInfo(false)}>
        <InfoBox onClick={() => openInfo(false)}>
          <ul>
            <li>Press enter to search</li>
            <li>Press esc to reset input</li>
            <li>Use * as wildcard for a single character</li>
            <li>Search phrase will always be used in the start of a word</li>
          </ul>
        </InfoBox>
      </Drawer>
    </Container>
  );
};

const InfoBox = styled.div`
  padding: 8px;
`;

const OpenInfo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 4px;
  cursor: pointer;
`;

const TypesContainer = styled.div`
  height: 41px;
  margin-left: 8px 0;
  border: 0;
  width: 380px;
  background-color: white;
  color: #767676;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding-left: 8px;
`;

const Container = styled.div`
  margin: 5px;
  margin-left: -10px;
  display: flex;
  flex-direction: row;
`;

const SearchInput = styled.input`
  height: 25px;
  padding: 8px;
  display: block;
  margin-left: 8px 0;
  border: 0;
  width: 300px;
  max-width: 100%;
`;

export default SearchBar;
