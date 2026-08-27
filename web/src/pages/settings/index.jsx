import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Grid, Tabs, Tab, Checkbox, Drawer } from '@material-ui/core';
import { Paper } from 'components/Paper';
import { RemoveCircle, Info } from '@material-ui/icons';
import Header from 'components/Header';
import Feedback from 'components/Feedback';
import { nickId } from 'utils/nick';
import { useStoreState, useStoreActions } from 'easy-peasy';
import Layout from 'components/Layout';
import Setting from './Setting';
import Themes from './Themes';
import Notifications from './Notifications';
import { useNavigate, useParams } from '@tanstack/react-router';
import DeviceSettings from './DeviceSettings';
import { Row, Column } from 'components/Containers';
import GenericUpload from 'features/GenericUpload';

const Settings = () => {
  const { tab } = useParams({ strict: false });
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
  const [info, openInfo] = useState(false);
  const [locked, setLocked] = useState(
    userInfo.TeamData ? userInfo.TeamData.Locked === 1 : 0,
  );
  const [ignoreNick, setIgnoreNick] = useState('');

  const navigate = useNavigate();

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
    <Layout edge t="Settings">
      <Tabs
        variant="scrollable"
        scrollButtons="auto"
        value={tab || ''}
        onChange={(e, value) => {
          navigate({ to: ['/settings', value].filter(Boolean).join('/') });
        }}
      >
        {nickId() > 0 && <Tab label="User info" value="" />}
        {nickId() > 0 && userInfo.TeamIndex && (
          <Tab label="Team" value="team" />
        )}
        {nickId() > 0 && <Tab label="Ignore" value="ignore" />}
        {nickId() > 0 && <Tab label="Site theme" value="themes" />}
        {nickId() > 0 && <Tab label="Notifications" value="notifications" />}
        <Tab label="Device Settings" value="device" />
      </Tabs>
      <Container>
        {nickId() > 0 ? (
          <>
            {!tab && (
              <Grid container spacing={0}>
                <Grid item xs={12} sm={6}>
                  <Setting
                    label={['Nick']}
                    maxLength={15}
                    update={() =>
                      updateUserInfo({ Value: [nick], Field: 'Kuski' })
                    }
                    value={[nick]}
                    setValue={v => setNick(v)}
                  />
                  <Setting
                    label={['Team']}
                    maxLength={9}
                    update={() =>
                      updateUserInfo({ Value: [team], Field: 'Team' })
                    }
                    value={[team]}
                    setValue={v => setTeam(v)}
                  />
                  <Setting
                    label={['Email']}
                    maxLength={255}
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
                    maxLength={26}
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
            {tab === 'team' && (
              <Grid container spacing={0}>
                <Grid item xs={12} sm={6}>
                  <Paper>
                    <PaperCon>
                      <Row>
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
                      </Row>
                      <Column>
                        <Header h2>Upload logo</Header>
                        <Column>
                          <div>
                            Current Logo:
                            {userInfo.TeamData?.Logo ? (
                              <LogoImg
                                src={userInfo.TeamData.Logo}
                                alt="Team logo"
                              />
                            ) : (
                              ' No logo'
                            )}
                          </div>
                          <div>
                            Max file size is 1mb. Logos will be shown with a
                            height of 20px and width up to 40px. Common aspect
                            ratio is 1/2. Most image types are supported
                            including animated.
                          </div>
                        </Column>
                        <GenericUpload
                          maxUploadSize={1000000}
                          filetype="img"
                          onUploaded={url =>
                            updateUserInfo({ Value: url, Field: 'Logo' })
                          }
                        />
                      </Column>
                    </PaperCon>
                  </Paper>
                </Grid>
              </Grid>
            )}
            {tab === 'ignore' && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Setting
                    header="Chat ignore a player"
                    label={['Ignore nick']}
                    update={() => ignoreKuski(ignoreNick)}
                    value={[ignoreNick]}
                    setValue={v => setIgnoreNick(v)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper padding>
                    <Header h2>Currently ignored</Header>
                    {ignored.map(i => (
                      <IgnoreCon
                        key={i.IgnoreIndex}
                        onClick={() => unignore(i.IgnoredKuskiIndex)}
                      >
                        <Remove /> {i.KuskiData.Kuski}
                      </IgnoreCon>
                    ))}
                  </Paper>
                </Grid>
              </Grid>
            )}
            {tab === 'themes' && <Themes />}
            {tab === 'notifications' && <Notifications />}
          </>
        ) : (
          <>{tab !== 'device' && <div>Log in to change settings.</div>}</>
        )}
        {tab === 'device' && <DeviceSettings />}

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
    </Layout>
  );
};

const Container = styled.div`
  padding: 20px;
`;

const InfoBox = styled.div`
  padding: 8px;
`;

const PaperCon = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
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

const LogoImg = styled.img`
  margin-left: ${p => p.theme.padSmall};
  height: 20px;
  max-width: 40px;
  object-fit: contain;
`;

export default Settings;
