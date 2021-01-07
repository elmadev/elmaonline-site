import React, { useState } from 'react';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';
import { useStoreState, useStoreActions } from 'easy-peasy';
import Link from 'components/Link';
import SearchBar from '../SearchBar';
// import TopBarActions from './TopBarActions';

const StyledButton = styled(Button)`
  a {
    color: #f1f1f1;
  }
`;

const TopBar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { loggedIn, username } = useStoreState(state => state.Login);
  const { logout } = useStoreActions(actions => actions.Login);

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const performLogout = () => {
    handleClose();
    logout();
  };

  return (
    <Root>
      <Container>
        <SearchBar />
        {!loggedIn && (
          <StyledButton color="inherit">
            <Link to="/login">Login</Link>
          </StyledButton>
        )}
        {loggedIn && (
          <div>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem>
                <Link to={`/kuskis/${username}`} onClick={handleClose}>
                  Profile
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to="/settings" onClick={handleClose}>
                  Settings
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to="/" onClick={performLogout}>
                  Log out
                </Link>
              </MenuItem>
            </Menu>
          </div>
        )}
      </Container>
    </Root>
  );
};

const Root = styled.div`
  top: 0;
  left: 0;
  background: #219653;
  color: #f1f1f1;
  position: fixed;
  width: 100%;
  box-sizing: border-box;
  line-height: 50px;
  padding-left: 250px;
  z-index: 10;
`;

const Container = styled.div`
  margin: 0 14px;
  display: flex;
  justify-content: space-between;
`;

export default TopBar;
