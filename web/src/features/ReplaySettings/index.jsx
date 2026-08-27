import React, { useState, useEffect, useMemo } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import styled from '@emotion/styled';
import { CropLandscape, Settings, Crop75, Close } from '@material-ui/icons';
import { Row, Text } from 'components/Containers';
import FieldBoolean from 'components/FieldBoolean';
import AutoComplete from 'components/AutoComplete';
import { Typography } from '@material-ui/core';

const ReplaySettings = ({ battle = false, lgrPage = false }) => {
  const [openSettings, setSettings] = useState(false);
  const {
    settings: {
      revealOnClick,
      autoPlay,
      grass,
      pictures,
      customSkyGround,
      theater,
      arrows,
      lgrOverride,
    },
  } = useStoreState(state => state.ReplaySettings);
  const { toggleSetting, setLgrOverride } = useStoreActions(
    actions => actions.ReplaySettings,
  );
  const { lgrs } = useStoreState(state => state.LGRList);
  const { getLGRs } = useStoreActions(actions => actions.LGRList);

  useEffect(() => {
    // triggers autoResize in recplayer-react
    window.dispatchEvent(new Event('resize'));
  }, [theater]);

  const lgrList = useMemo(() => {
    const list = lgrs.map(lgr => ({
      label: lgr.LGRName,
      id: lgr.LGRIndex,
      key: lgr.LGRName,
      url: lgr.FileLink,
    }));
    list.push({ label: `legacy (png's)`, id: 0, key: 'legacy', url: '' });
    return list;
  }, [lgrs]);

  return (
    <Row jc="flex-end" ai="center">
      {openSettings && (
        <SettingsContainer>
          <Text light small noPad r="Small">
            Refresh to apply changes
          </Text>
          {battle && (
            <FieldBoolean
              size="small"
              value={revealOnClick}
              label="Reveal on click"
              onChange={() => toggleSetting('revealOnClick')}
            />
          )}
          <FieldBoolean
            size="small"
            value={autoPlay}
            label="Autoplay"
            onChange={() => toggleSetting('autoPlay')}
          />
          <FieldBoolean
            size="small"
            value={grass}
            label="Grass"
            onChange={() => toggleSetting('grass')}
          />
          <FieldBoolean
            size="small"
            value={arrows}
            label="Gravity arrows"
            onChange={() => toggleSetting('arrows')}
          />
          <FieldBoolean
            size="small"
            value={pictures}
            label="Pictures"
            onChange={() => toggleSetting('pictures')}
          />
          <FieldBoolean
            size="small"
            value={customSkyGround}
            label="Custom sky/ground"
            onChange={() => toggleSetting('customSkyGround')}
          />
          {!lgrPage && (
            <>
              <Typography>Override all levels with lgr:&nbsp;</Typography>
              <LgrSelect>
                <AutoComplete
                  options={lgrList}
                  value={lgrOverride || null}
                  onChange={value =>
                    setLgrOverride({
                      name: value?.key || '',
                      url: value?.url || '',
                    })
                  }
                  getOptionLabel={option => {
                    if (typeof option === 'string') {
                      return option;
                    }
                    if (option) {
                      return option.label;
                    }
                    return '';
                  }}
                  getOptionSelected={(o, v) => (v ? o.key === v : false)}
                  onOpen={() => {
                    if (!lgrs?.length) {
                      getLGRs();
                    }
                  }}
                  loading={!lgrs?.length}
                />
              </LgrSelect>
            </>
          )}
        </SettingsContainer>
      )}
      <Icon onClick={() => setSettings(!openSettings)}>
        {openSettings ? <Close /> : <Settings />}
      </Icon>
      <IconTheater onClick={() => toggleSetting('theater')}>
        {theater ? <Crop75 /> : <CropLandscape />}
      </IconTheater>
    </Row>
  );
};

const SettingsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  @media (max-width: 1100px) {
    flex-direction: column;
  }
  margin-top: 14px;
`;

const Icon = styled.div`
  padding: ${p => p.theme.padXSmall};
  cursor: pointer;
`;

const IconTheater = styled(Icon)`
  @media (max-width: 1100px) {
    display: none;
  }
`;

const LgrSelect = styled.div`
  width: 200px;
`;

export default ReplaySettings;
