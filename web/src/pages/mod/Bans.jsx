import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { Grid } from '@material-ui/core';
import { Paper } from 'components/Paper';
import { ListRow, ListCell, ListHeader } from 'components/List';
import { useStoreState, useStoreActions } from 'easy-peasy';
import Kuski from 'components/Kuski';
import Header from 'components/Header';
import LocalTime from 'components/LocalTime';

const Bans = () => {
  const { banlist } = useStoreState(state => state.Mod);
  const { getBanlist } = useStoreActions(actions => actions.Mod);

  useEffect(() => {
    getBanlist();
  }, []);

  return (
    <Container>
      <Grid container spacing={0}>
        <Grid item xs={12} sm={6}>
          <Header h2>IP Bans</Header>
          <Paper>
            <ListHeader>
              <ListCell>Kuski</ListCell>
              <ListCell>IP</ListCell>
              <ListCell>Ban type</ListCell>
              <ListCell>Expires</ListCell>
              <ListCell>Type</ListCell>
            </ListHeader>
            {banlist.ips.length > 0 &&
              banlist.ips.map(n => (
                <ListRow key={n.BanIndex} title={n.Reason}>
                  <ListCell>
                    <Kuski kuskiData={n.KuskiData} />
                  </ListCell>
                  <ListCell>{n.IP}</ListCell>
                  <ListCell>{n.BanType}</ListCell>
                  <ListCell>
                    <LocalTime
                      date={n.Expires}
                      format="d MMM yyyy HH:mm:ss"
                      parse="X"
                    />
                  </ListCell>
                  <ListCell>{n.Type}</ListCell>
                </ListRow>
              ))}
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Header h2>Flag Bans</Header>
          <Paper>
            <ListHeader>
              <ListCell>Kuski</ListCell>
              <ListCell>Ban type</ListCell>
              <ListCell>Expire date</ListCell>
              <ListCell>Severeness</ListCell>
            </ListHeader>
            {banlist.flags.length > 0 &&
              banlist.flags.map(n => (
                <ListRow key={n.FlagBanIndex} title={n.Reason}>
                  <ListCell>
                    <Kuski kuskiData={n.KuskiData} />
                  </ListCell>
                  <ListCell>{n.BanType}</ListCell>
                  <ListCell>
                    <LocalTime
                      date={n.ExpireDate}
                      format="d MMM yyyy HH:mm:ss"
                      parse="X"
                    />
                  </ListCell>
                  <ListCell>{n.Severeness}</ListCell>
                </ListRow>
              ))}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
`;

export default Bans;
