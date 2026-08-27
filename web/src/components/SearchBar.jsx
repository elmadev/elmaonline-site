import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import styled from '@emotion/styled';
import { Button, Drawer, IconButton } from '@material-ui/core';
import { Info, Cancel } from '@material-ui/icons';

const SearchBar = props => {
  const { hidePlaceholder } = props;
  const navigate = useNavigate();
  const [searchType, setType] = useState('');
  const [value, setValue] = useState('');
  const [info, openInfo] = useState(false);
  return (
    <Container>
      {searchType === '' ? (
        <TypesContainer>
          {!hidePlaceholder && <Placeholder>Search:</Placeholder>}
          <Button onClick={() => setType('level')}>Level</Button>
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
              if (e.key === 'Enter') {
                if (e.target.value === '') {
                  setType('');
                } else {
                  navigate({
                    to: `/search?q=${encodeURIComponent(
                      e.target.value,
                    )}&t=${searchType}`,
                  });
                }
              }
              if (e.key === 'Escape') {
                setValue('');
                setType('');
              }
            }}
          />
          <Reset>
            <IconButton
              aria-label="reset"
              onClick={() => {
                setValue('');
                setType('');
              }}
            >
              <Cancel />
            </IconButton>
          </Reset>
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
            <li>Use ? as wildcard for a single character</li>
            <li>Use * as wildcard for multiple characters</li>
            <li>By default there&apos;s a * wildcard at the end</li>
            <li>You can use "int01" etc. to search for internals</li>
          </ul>
        </InfoBox>
      </Drawer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  .MuiButton-root {
    min-width: 0;
    display: block;
    padding: 3px 6px;
    margin: 0 2px;
    &:hover {
      background-color: rgba(0, 0, 0, 0.2);
    }
    .MuiButton-label {
      display: block;
      font-size: 13px;
    }
  }
`;

const TypesContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  border: 0;
  background-color: ${p => p.theme.paperBackground};
  color: ${p => p.theme.lightTextColor};
  padding: 5px 8px 5px 12px;
  border-radius: 4px;
`;

const Reset = styled.div`
  display: block;
  margin-left: 3px;
  button {
    padding: 5px;
    color: inherit;
  }
`;

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

const SearchInput = styled.input`
  height: 22px;
  padding: 8px;
  display: block;
  margin-left: 8px 0;
  border: 0;
  width: 300px;
  max-width: 100%;
`;

const Placeholder = styled.span`
  margin-bottom: 3px;
  margin-right: 1px;
  font-size: 14px;
`;

export default SearchBar;
