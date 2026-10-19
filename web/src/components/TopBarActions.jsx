import React, { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import {
  Notifications,
  AccountCircle,
  PlayCircleOutline,
  TimerOutlined,
  ExitToApp,
  Settings,
  FastRewind,
} from '@mui/icons-material';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import { useNavigate } from '@tanstack/react-router';
import { useStoreState, useStoreActions } from 'easy-peasy';
import styled from '@emotion/styled';
import Badge from '@mui/material/Badge';

const StyledButton = styled(Button)`
  a {
    color: #f1f1f1;
  }
`;

const Item = styled(MenuItem)`
  && {
    color: ${p => p.theme.linkColor};
    padding-left: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
  }
`;

const SmallItem = styled(Item)`
  && {
    font-size: 14px;
    padding-left: 24px;
  }
`;

const Nick = styled.div`
  padding-left: 16px;
  padding-top: 0;
  padding-bottom: 10px;
  padding-right: 16px;
  text-align: center;
`;

const ReplayIcon = styled(PlayCircleOutline)`
  margin-right: 4px;
`;

const TimesIcon = styled(TimerOutlined)`
  margin-right: 4px;
`;

const ProfileIcon = styled(AccountCircle)`
  margin-right: 4px;
`;

const SettingsIcon = styled(Settings)`
  margin-right: 4px;
`;

const LogOutIcon = styled(ExitToApp)`
  margin-right: 4px;
`;

const RecapIcon = styled(FastRewind)`
  margin-right: 4px;
`;

const Line = styled.hr`
  margin: 0;
`;

export default function TopBarActions() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { loggedIn, username, notificationsCount } = useStoreState(
    state => state.Login,
  );
  const { logout, getNotificationsCount } = useStoreActions(
    actions => actions.Login,
  );

  useEffect(() => {
    if (loggedIn) {
      getNotificationsCount();
    }
  }, []);

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = to => {
    setAnchorEl(null);
    if (to) {
      navigate({ to: to });
    }
  };

  const performLogout = () => {
    handleClose();
    logout();
    navigate({ to: '/' });
  };

  const handleNotificationsClick = () => {
    navigate({ to: `/kuskis/${username}/notifications` });
  };

  return (
    <>
      {!loggedIn && (
        <StyledButton
          color="inherit"
          onClick={() => navigate({ to: '/login' })}
        >
          Login
        </StyledButton>
      )}
      {loggedIn && (
        <div>
          <IconButton
            aria-label="notifications"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleNotificationsClick}
            color="inherit"
            size="large"
          >
            <Badge
              badgeContent={notificationsCount}
              color="error"
              overlap="rectangular"
            >
              <Notifications />
            </Badge>
          </IconButton>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
            size="large"
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
            onClose={() => handleClose('')}
          >
            <Nick>{username}</Nick>
            <Line />
            <Item onClick={() => handleClose(`/kuskis/${username}`)}>
              <ProfileIcon /> Profile
            </Item>
            <SmallItem onClick={() => handleClose(`/kuskis/${username}/times`)}>
              <TimesIcon /> Times
            </SmallItem>
            <SmallItem
              onClick={() =>
                handleClose(`/kuskis/${username}/replays-uploaded`)
              }
            >
              <ReplayIcon /> Replays
            </SmallItem>
            <Line />
            <Item onClick={() => handleClose('/recap')}>
              <RecapIcon />
              Recap
            </Item>
            <Item onClick={() => handleClose('/settings')}>
              <SettingsIcon />
              Settings
            </Item>
            <Item onClick={() => performLogout()}>
              <LogOutIcon />
              Log out
            </Item>
          </Menu>
        </div>
      )}
    </>
  );
}
