/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Grid, Tabs, Tab, Checkbox, Drawer } from '@material-ui/core';
import { Paper } from 'styles/Paper';
import { RemoveCircle, Info } from '@material-ui/icons';
import Header from 'components/Header';
import Feedback from 'components/Feedback';
import { nickId } from 'utils/nick';
import { useStoreState, useStoreActions } from 'easy-peasy';
import Setting from './Setting';

const Settings = () => {
  const { userInfo, error, message, ignored } = useStoreState(
    state => state.Settings,
  );
  const {
    getUserInfo,
    updateUserInfo,
    setError,
    setMessage,
    ignore,
    getIgnored,
    unignore,
  } = useStoreActions(actions => actions.Settings);
  const [nick, setNick] = useState(userInfo.Kuski ? userInfo.Kuski : '');
  const [team, setTeam] = useState(
    userInfo.TeamData ? userInfo.TeamData.Team : '',
  );
  const [email, setEmail] = useState(userInfo.Email ? userInfo.Email : '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordAgain, setNewPasswordAgain] = useState('');
  const [tab, setTab] = useState(0);
  const [info, openInfo] = useState(false);
  const [locked, setLocked] = useState(
    userInfo.TeamData ? userInfo.TeamData.Locked === 1 : 0,
  );
  const [ignoreNick, setIgnoreNick] = useState('');

  useEffect(() => {
    const KuskiIndex = nickId();
    if (KuskiIndex > 0) {
      getUserInfo(KuskiIndex);
      getIgnored();
    }
  }, []);

  useEffect(() => {
    if (userInfo) {
      setNick(userInfo.Kuski);
      setTeam(userInfo.TeamData ? userInfo.TeamData.Team : '');
      setEmail(userInfo.Email);
      setLocked(userInfo.TeamData ? userInfo.TeamData.Locked === 1 : 0);
    }
  }, [userInfo]);

  const ignoreKuski = i => {
    setIgnoreNick('');
    ignore(i);
  };

  return (
    <>
      <Tabs
        variant="scrollable"
        scrollButtons="auto"
        value={tab}
        onChange={(e, value) => setTab(value)}
      >
        <Tab label="User info" />
        <Tab label="Team" />
        <Tab label="Ignore" />
        <Tab label="Notifications" />
      </Tabs>
      <Container>
        {nickId() > 0 ? (
          <>
            {tab === 0 && (
              <Grid container spacing={0}>
                <Grid item xs={12} sm={6}>
                  <Setting
                    label={['Nick']}
                    update={() =>
                      updateUserInfo({ Value: [nick], Field: 'Kuski' })
                    }
                    value={[nick]}
                    setValue={v => setNick(v)}
                  />
                  <Setting
                    label={['Team']}
                    update={() =>
                      updateUserInfo({ Value: [team], Field: 'Team' })
                    }
                    value={[team]}
                    setValue={v => setTeam(v)}
                  />
                  <Setting
                    label={['Email']}
                    update={() =>
                      updateUserInfo({ Value: [email], Field: 'Email' })
                    }
                    value={[email]}
                    setValue={v => setEmail(v)}
                  />
                  <Setting
                    password
                    label={[
                      'Old password',
                      'New password',
                      'New password again',
                    ]}
                    update={() =>
                      updateUserInfo({
                        Value: [oldPassword, newPassword, newPasswordAgain],
                        Field: 'Password',
                      })
                    }
                    value={[oldPassword, newPassword, newPasswordAgain]}
                    setValue={(value, index) => {
                      if (index === 0) {
                        setOldPassword(value);
                      }
                      if (index === 1) {
                        setNewPassword(value);
                      }
                      if (index === 2) {
                        setNewPasswordAgain(value);
                      }
                    }}
                  />
                </Grid>
              </Grid>
            )}
            {tab === 1 && (
              <Grid container spacing={0}>
                <Grid item xs={12} sm={6}>
                  <Paper>
                    <PaperCon>
                      <Checkbox
                        checked={locked}
                        onChange={() =>
                          updateUserInfo({
                            Value: locked ? [0] : [1],
                            Field: 'Locked',
                          })
                        }
                        value="Locked"
                        color="primary"
                      />
                      <Text>Lock team</Text>
                      <OpenInfo onClick={() => openInfo(!info)}>
                        <Info />
                      </OpenInfo>
                    </PaperCon>
                  </Paper>
                </Grid>
              </Grid>
            )}
            {tab === 2 && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Header h2>Chat ignore a player</Header>
                  <Setting
                    label={['Ignore nick']}
                    update={() => ignoreKuski(ignoreNick)}
                    value={[ignoreNick]}
                    setValue={v => setIgnoreNick(v)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Header h2>Currently ignored</Header>
                  <Paper>
                    <PaperCon>
                      {ignored.map(i => (
                        <IgnoreCon
                          onClick={() => unignore(i.IgnoredKuskiIndex)}
                        >
                          <Remove /> {i.KuskiData.Kuski}
                        </IgnoreCon>
                      ))}
                    </PaperCon>
                  </Paper>
                </Grid>
              </Grid>
            )}
          </>
        ) : (
          <div>Log in to change settings.</div>
        )}
        <Feedback
          open={error !== ''}
          text={error}
          type="error"
          close={() => setError('')}
        />
        <Feedback
          open={message !== ''}
          text={message}
          type="success"
          close={() => setMessage('')}
        />
        <Drawer anchor="bottom" open={info} onClose={() => openInfo(false)}>
          <InfoBox onClick={() => openInfo(false)}>
            <ul>
              <li>
                If a team is locked it&apos;s not possible for anyone to join
                the team
              </li>
              <li>All team members can lock and unlock the team</li>
            </ul>
          </InfoBox>
        </Drawer>
      </Container>
    </>
  );
};

const Container = styled.div`
  padding: 20px;
`;

const InfoBox = styled.div`
  padding: 8px;
`;

const PaperCon = styled.div`
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 10px;
  display: flex;
  flex-direction: row;
`;

const OpenInfo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 4px;
  cursor: pointer;
`;

const Text = styled.div`
  align-self: center;
`;

const Remove = styled(RemoveCircle)`
  font-size: 12px;
`;

const IgnoreCon = styled.div`
  margin-top: 4px;
  cursor: pointer;
`;

export default Settings;
