import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import Header from 'components/Header';
import { nickId } from 'utils/nick';
import { useStoreState, useStoreActions } from 'easy-peasy';
import Setting from './Setting';

const Settings = () => {
  const { userInfo } = useStoreState(state => state.Settings);
  const { getUserInfo } = useStoreActions(actions => actions.Settings);
  const [nick, setNick] = useState(userInfo.Kuski);
  const [team, setTeam] = useState(userInfo.TeamData.Team);
  const [email, setEmail] = useState(userInfo.Email);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordAgain, setNewPasswordAgain] = useState('');

  useEffect(() => {
    const KuskiIndex = nickId();
    if (KuskiIndex > 0) {
      getUserInfo(KuskiIndex);
    }
  }, []);

  return (
    <Container>
      {nickId() > 0 ? (
        <Grid container spacing={0}>
          <Grid item xs={12} sm={6}>
            <Header h1>Change user info</Header>
            <Setting
              label={['Nick']}
              update={() => {}}
              value={[nick]}
              setValue={v => setNick(v)}
            />
            <Setting
              label={['Team']}
              update={() => {}}
              value={[team]}
              setValue={v => setTeam(v)}
            />
            <Setting
              label={['Email']}
              update={() => {}}
              value={[email]}
              setValue={v => setEmail(v)}
            />
            <Setting
              label={['Old password', 'New password', 'New password again']}
              update={() => {}}
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
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
`;

export default Settings;
