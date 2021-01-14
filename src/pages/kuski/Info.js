import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import AchievementsCups from 'components/AchievementsCups';
import AchievementsHacktober from 'components/AchievementsHacktober';
import Header from 'components/Header';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { mod, admin } from 'utils/nick';
import LocalTime from 'components/LocalTime';
import { ListCell, ListRow, ListHeader, ListContainer } from 'styles/List';
import {
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@material-ui/core';
import RPlay from '../../images/rights/RPlay.png';
import RStartBattle from '../../images/rights/RStartBattle.png';
import RSpecialBattle from '../../images/rights/RSpecialBattle.png';
import RStartCup from '../../images/rights/RStartCup.png';
import RStart24htt from '../../images/rights/RStart24htt.png';
import RStop from '../../images/rights/RStop.png';
import RMultiPlay from '../../images/rights/RMultiPlay.png';
import RChat from '../../images/rights/RChat.png';
import RBan from '../../images/rights/RBan.png';
import RMod from '../../images/rights/RMod.png';
import RAdmin from '../../images/rights/RAdmin.png';

const Info = ({ kuskiInfo }) => {
  const {
    giveRights,
    getIplogs,
    setIplogs,
    getKuskiBans,
    banKuski,
  } = useStoreActions(actions => actions.Kuski);
  const { iplogs, kuskiBans } = useStoreState(state => state.Kuski);
  const [banType, setBanType] = useState('PlayBan');
  const [severity, setSeverity] = useState('warning');
  const [banText, setBanText] = useState('');
  useEffect(() => {
    setIplogs([]);
  }, []);
  useEffect(() => {
    if (mod() === 1) {
      getKuskiBans(kuskiInfo.KuskiIndex);
    }
  }, [kuskiInfo]);
  const ban = () => {
    banKuski({ banType, severity, banText, KuskiIndex: kuskiInfo.KuskiIndex });
  };
  return (
    <SubContainer>
      <Header h3>Rights</Header>
      <Rights>
        {kuskiInfo.RPlay === 1 && <img src={RPlay} alt="RPlay" title="Play" />}
        {kuskiInfo.RMultiPlay === 1 && (
          <img src={RMultiPlay} alt="RMultiPlay" title="Multiplay" />
        )}
        {kuskiInfo.RChat === 1 && <img src={RChat} alt="RChat" title="Chat" />}
        {kuskiInfo.RStartBattle === 1 && (
          <img src={RStartBattle} alt="RStartBattle" title="Start battle" />
        )}
        {kuskiInfo.RSpecialBattle === 1 && (
          <img
            src={RSpecialBattle}
            alt="RSpecialBattle"
            title="Start special battle"
          />
        )}
        {kuskiInfo.RStart24htt === 1 && (
          <img src={RStart24htt} alt="RStart24htt" title="Start 24 hour TT" />
        )}
        {kuskiInfo.RStartCup === 1 && (
          <img src={RStartCup} alt="RStartCup" title="Start cup" />
        )}
        {kuskiInfo.RStop === 1 && (
          <img src={RStop} alt="RStop" title="Abort/Stop battle" />
        )}
        {kuskiInfo.RBan === 1 && <img src={RBan} alt="RBan" title="Ban" />}
        {kuskiInfo.RMod === 1 && <img src={RMod} alt="RMod" title="Mod" />}
        {kuskiInfo.RAdmin === 1 && (
          <img src={RAdmin} alt="RAdmin" title="Admin" />
        )}
      </Rights>
      {mod() === 1 && (
        <>
          <Header h3>Give Rights</Header>
          <Rights>
            {kuskiInfo.RStartBattle === 0 && (
              <GiveImg
                onClick={() =>
                  giveRights({
                    Right: 'RStartBattle',
                    KuskiIndex: kuskiInfo.KuskiIndex,
                    name: kuskiInfo.Kuski,
                  })
                }
                src={RStartBattle}
                alt="RStartBattle"
                title="RStartBattle"
              />
            )}
            {kuskiInfo.RSpecialBattle === 0 && (
              <GiveImg
                onClick={() =>
                  giveRights({
                    Right: 'RSpecialBattle',
                    KuskiIndex: kuskiInfo.KuskiIndex,
                    name: kuskiInfo.Kuski,
                  })
                }
                src={RSpecialBattle}
                alt="RSpecialBattle"
                title="RSpecialBattle"
              />
            )}
            {kuskiInfo.RStart24htt === 0 && (
              <GiveImg
                onClick={() =>
                  giveRights({
                    Right: 'RStart24htt',
                    KuskiIndex: kuskiInfo.KuskiIndex,
                    name: kuskiInfo.Kuski,
                  })
                }
                src={RStart24htt}
                alt="RStart24htt"
                title="RStart24htt"
              />
            )}
            {kuskiInfo.RStop === 0 && (
              <GiveImg
                onClick={() =>
                  giveRights({
                    Right: 'RStop',
                    KuskiIndex: kuskiInfo.KuskiIndex,
                    name: kuskiInfo.Kuski,
                  })
                }
                src={RStop}
                alt="RStop"
                title="RStop"
              />
            )}
            {kuskiInfo.RBan === 0 && admin() === 1 && (
              <GiveImg
                onClick={() =>
                  giveRights({
                    Right: 'RBan',
                    KuskiIndex: kuskiInfo.KuskiIndex,
                    name: kuskiInfo.Kuski,
                  })
                }
                src={RBan}
                alt="RBan"
                title="RBan"
              />
            )}
            {kuskiInfo.RMod === 0 && admin() === 1 && (
              <GiveImg
                onClick={() =>
                  giveRights({
                    Right: 'RMod',
                    KuskiIndex: kuskiInfo.KuskiIndex,
                    name: kuskiInfo.Kuski,
                  })
                }
                src={RMod}
                alt="RMod"
                title="RMod"
              />
            )}
          </Rights>
        </>
      )}
      <AchievementsCups KuskiIndex={kuskiInfo.KuskiIndex} />
      <AchievementsHacktober KuskiIndex={kuskiInfo.KuskiIndex} />
      {mod() === 1 && (
        <>
          <Header h3>IP Logs</Header>
          {iplogs.length > 0 ? (
            <ListContainer>
              <ListHeader>
                <ListCell>Log From</ListCell>
                <ListCell>Log To</ListCell>
                <ListCell>Player</ListCell>
                <ListCell>IP</ListCell>
              </ListHeader>
              {iplogs.map(i => (
                <ListRow key={i.LogIndex}>
                  <ListCell>
                    <LocalTime
                      date={i.LogFrom}
                      format="D MMM YYYY HH:mm:ss"
                      parse="X"
                    />
                  </ListCell>
                  <ListCell>
                    <LocalTime
                      date={i.LogTo}
                      format="D MMM YYYY HH:mm:ss"
                      parse="X"
                    />
                  </ListCell>
                  <ListCell>{i.Player}</ListCell>
                  <ListCell>{i.IP}</ListCell>
                </ListRow>
              ))}
            </ListContainer>
          ) : (
            <Button
              variant="contained"
              onClick={() => getIplogs(kuskiInfo.KuskiIndex)}
            >
              Get IP logs
            </Button>
          )}
          <Header h3>Bans</Header>
          {kuskiBans.ips.length > 0 && (
            <ListContainer>
              <ListHeader>
                <ListCell width={150}>IP</ListCell>
                <ListCell width={150}>Expires</ListCell>
                <ListCell width={150}>Severeness</ListCell>
                <ListCell>Reason</ListCell>
              </ListHeader>
              {kuskiBans.ips.map(i => (
                <ListRow key={i.BanIndex}>
                  <ListCell width={150}>{i.IP}</ListCell>
                  <ListCell width={150}>
                    <LocalTime
                      date={i.Expires}
                      format="D MMM YYYY HH:mm:ss"
                      parse="X"
                    />
                  </ListCell>
                  <ListCell width={150}>{i.Type}</ListCell>
                  <ListCell>{i.Reason}</ListCell>
                </ListRow>
              ))}
            </ListContainer>
          )}
          {kuskiBans.flags.length > 0 && (
            <ListContainer>
              <ListHeader>
                <ListCell width={150}>Type</ListCell>
                <ListCell width={150}>Expires</ListCell>
                <ListCell width={150}>Severeness</ListCell>
                <ListCell>Reason</ListCell>
              </ListHeader>
              {kuskiBans.flags.map(i => (
                <ListRow key={i.FlagBanIndex}>
                  <ListCell width={150}>{i.BanType}</ListCell>
                  <ListCell width={150}>
                    <LocalTime
                      date={i.ExpireDate}
                      format="D MMM YYYY HH:mm:ss"
                      parse="X"
                    />
                  </ListCell>
                  <ListCell width={150}>{i.Severeness}</ListCell>
                  <ListCell>{i.Reason}</ListCell>
                </ListRow>
              ))}
            </ListContainer>
          )}
          <Header h3>Give Ban</Header>
          <FormControl>
            <InputLabel htmlFor="type-simple">Ban Type</InputLabel>
            <Select
              value={banType}
              onChange={e => setBanType(e.target.value)}
              inputProps={{
                name: 'type',
                id: 'type-simple',
              }}
              style={{ minWidth: '250px' }}
            >
              <MenuItem value="PlayBan">Play</MenuItem>
              <MenuItem value="ChatBan">Chat</MenuItem>
              <MenuItem value="StartBan">Start</MenuItem>
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="severity-simple">Severity</InputLabel>
            <Select
              value={severity}
              onChange={e => setSeverity(e.target.value)}
              inputProps={{
                name: 'severity',
                id: 'severity-simple',
              }}
              style={{ minWidth: '250px' }}
            >
              <MenuItem value="warning">Warning</MenuItem>
              <MenuItem value="week">1 week</MenuItem>
              <MenuItem value="twoweek">2 weeks</MenuItem>
              <MenuItem value="year">Year</MenuItem>
            </Select>
          </FormControl>
          <TextField
            id="outlined-name"
            label="Reason"
            value={banText}
            onChange={e => setBanText(e.target.value)}
            margin="normal"
            variant="outlined"
            fullWidth
          />
          <Button variant="contained" onClick={() => ban()}>
            Ban
          </Button>
        </>
      )}
    </SubContainer>
  );
};

const GiveImg = styled.img`
  cursor: pointer;
`;

const Rights = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  img {
    padding: 8px;
  }
`;

const SubContainer = styled.div`
  margin-left: 8px;
`;

export default Info;
