/* eslint-disable react/no-danger */
import React, { useEffect, Fragment } from 'react';
import styled from 'styled-components';
import { nickId } from 'utils/nick';
import Grid from '@material-ui/core/Grid';
import Header from 'components/Header';
import Time from 'components/Time';
import { zeroPad } from 'utils/time';
import { useStoreState, useStoreActions } from 'easy-peasy';

const Team = () => {
  const { teamReplays, cup } = useStoreState(state => state.Cup);
  const { getTeamReplays } = useStoreActions(actions => actions.Cup);

  useEffect(() => {
    getTeamReplays(cup.CupGroupIndex);
  }, []);

  return (
    <Container>
      {nickId() > 0 && (
        <Grid container spacing={0}>
          <Grid item xs={12} sm={6}>
            <Header h2>Team replays</Header>
            <div>List of all team replays that has been set to shared.</div>
            {teamReplays.map((e, i) => (
              <Fragment key={e.CupIndex}>
                <Header h3 top>
                  Event {i + 1}
                </Header>
                {e.CupTimes.filter(t => t.Replay).map(replay => (
                  <ReplayCon key={replay.CupTimeIndex}>
                    <Rec
                      href={`/dl/cupreplay/${replay.CupTimeIndex}/${
                        cup.ShortName
                      }${zeroPad(i + 1, 2)}${replay.KuskiData.Kuski.substring(
                        0,
                        6,
                      )}/${replay.Code}`}
                    >
                      {replay.TimeExists && <>✓ </>}
                      <Time time={replay.Time} apples={-1} />
                    </Rec>
                    by {replay.KuskiData.Kuski}
                    {replay.Comment !== '0' && replay.Comment !== '' && (
                      <Desc>{replay.Comment}</Desc>
                    )}
                  </ReplayCon>
                ))}
              </Fragment>
            ))}
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

const ReplayCon = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const Rec = styled.a`
  margin-right: 8px;
`;

const Desc = styled.div`
  font-size: 13px;
  margin-left: 8px;
`;

const Container = styled.div`
  padding: 8px;
`;

export default Team;
