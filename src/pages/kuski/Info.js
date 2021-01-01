import React, { useEffect } from 'react';
import styled from 'styled-components';
import AchievementsCups from 'components/AchievementsCups';
import AchievementsHacktober from 'components/AchievementsHacktober';
import Header from 'components/Header';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { mod, admin } from 'utils/nick';
import LocalTime from 'components/LocalTime';
import { ListCell, ListRow, ListHeader, ListContainer } from 'styles/List';
import { Button } from '@material-ui/core';
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
  const { giveRights, getIplogs, setIplogs } = useStoreActions(
    actions => actions.Kuski,
  );
  const { iplogs } = useStoreState(state => state.Kuski);
  useEffect(() => {
    setIplogs([]);
  }, []);
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
          <Button
            variant="contained"
            onClick={() => getIplogs(kuskiInfo.KuskiIndex)}
          >
            Get IP logs
          </Button>
          {iplogs.length > 0 && (
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
          )}
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
