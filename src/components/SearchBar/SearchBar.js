import React, { useState } from 'react';
import history from 'utils/history';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';

const SearchBar = () => {
  const [searchType, setType] = useState('');
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
        <SearchInput
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
          }}
        />
      )}
    </Container>
  );
};

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
