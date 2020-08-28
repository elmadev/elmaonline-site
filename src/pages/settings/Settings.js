/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import Header from 'components/Header';
import Feedback from 'components/Feedback';
import { nickId } from 'utils/nick';
import { useStoreState, useStoreActions } from 'easy-peasy';
import Setting from './Setting';

const Settings = () => {
  const { userInfo, error, message } = useStoreState(state => state.Settings);
  const { getUserInfo, updateUserInfo, setError, setMessage } = useStoreActions(
    actions => actions.Settings,
  );
  const [nick, setNick] = useState(userInfo.Kuski ? userInfo.Kuski : '');
  const [team, setTeam] = useState(
    userInfo.TeamData ? userInfo.TeamData.Team : '',
  );
  const [email, setEmail] = useState(userInfo.Email ? userInfo.Email : '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordAgain, setNewPasswordAgain] = useState('');

  useEffect(() => {
    const KuskiIndex = nickId();
    if (KuskiIndex > 0) {
      getUserInfo(KuskiIndex);
    }
  }, []);

  useEffect(() => {
    if (userInfo) {
      setNick(userInfo.Kuski);
      setTeam(userInfo.TeamData ? userInfo.TeamData.Team : '');
      setEmail(userInfo.Email);
    }
  }, [userInfo]);

  return (
    <Container>
      {nickId() > 0 ? (
        <Grid container spacing={0}>
          <Grid item xs={12} sm={6}>
            <Header h1>Change user info</Header>
            <Setting
              label={['Nick']}
              update={() => updateUserInfo({ Value: [nick], Field: 'Kuski' })}
              value={[nick]}
              setValue={v => setNick(v)}
            />
            <Setting
              label={['Team']}
              update={() => updateUserInfo({ Value: [team], Field: 'Team' })}
              value={[team]}
              setValue={v => setTeam(v)}
            />
            <Setting
              label={['Email']}
              update={() => updateUserInfo({ Value: [email], Field: 'Email' })}
              value={[email]}
              setValue={v => setEmail(v)}
            />
            <Setting
              password
              label={['Old password', 'New password', 'New password again']}
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
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
`;

export default Settings;
