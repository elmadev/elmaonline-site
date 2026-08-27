import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import SearchIcon from '@material-ui/icons/Search';
import Link from 'components/Link';
import SearchBar from 'components/SearchBar';
import { useMediaQuery, Chip } from '@material-ui/core';
import { Error } from '@material-ui/icons';
import { useNavigate } from '@tanstack/react-router';
import TopBarActions from 'components/TopBarActions';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { isBefore, addHours } from 'date-fns';
import Alert from 'components/Alert';

const TopBar = () => {
  const [statusOpen, setStatusOpen] = useState(false);
  const navigate = useNavigate();
  const { status } = useStoreState(state => state.Login);
  const { getStatus, setStatus } = useStoreActions(actions => actions.Login);
  const mobileSearch = useMediaQuery('(max-width: 540px)');

  useEffect(() => {
    if (!status.updated) {
      getStatus();
    } else {
      if (isBefore(addHours(status.updated, 1), new Date())) {
        getStatus();
      }
    }
  }, []);

  return (
    <Root>
      <Container>
        {!mobileSearch && <SearchBar />}
        {status.show === 1 && (
          <>
            <Chip
              icon={<Error />}
              label={mobileSearch ? 'STATUS' : `STATUS: ${status.headline}`}
              color="secondary"
              onClick={() => setStatusOpen(true)}
              onDelete={() => setStatus({ ...status, show: 0 })}
              clickable
            />
            <Alert
              title={`STATUS: ${status.headline}`}
              open={statusOpen}
              text={status.text}
              onClose={() => setStatusOpen(false)}
              options={['Close']}
            />
          </>
        )}
        <RightSideFlex>
          {mobileSearch && (
            <MobileSearchButton onClick={() => navigate({ to: '/search' })}>
              <Link to="/search" style={{ color: 'inherit', padding: '5px' }}>
                <SearchIcon />
              </Link>
            </MobileSearchButton>
          )}
          <TopBarActions />
        </RightSideFlex>
      </Container>
    </Root>
  );
};

const Root = styled.div`
  top: 0;
  left: 0;
  background: ${p => p.theme.primary};
  color: #f1f1f1;
  position: fixed;
  width: 100%;
  box-sizing: border-box;
  padding-left: 250px;
  z-index: 10;
  @media screen and (max-width: 768px) {
    padding-left: 50px;
  }
  @media screen and (max-width: 540px) {
    .top-bar-search-bar {
      display: none;
    }
  }
`;

const Container = styled.div`
  margin: 0 17px 0 24px;
  height: 54px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media screen and (max-width: 540px) {
    justify-content: flex-end;
  }
`;

const RightSideFlex = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const MobileSearchButton = styled.div`
  margin-right: 8px;
`;

export default TopBar;
