import React from 'react';
import styled from 'styled-components';
import AchievementsCups from 'components/AchievementsCups';
import AchievementsHacktober from 'components/AchievementsHacktober';
import Header from 'components/Header';
import { useStoreActions } from 'easy-peasy';
import { mod, admin } from 'utils/nick';
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
  const { giveRights } = useStoreActions(actions => actions.Kuski);
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
