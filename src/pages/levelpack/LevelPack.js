import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useStoreState, useStoreActions, useStoreRehydrated } from 'easy-peasy';
import {
  Settings as SettingsIcon,
  Close as CloseIcon,
} from '@material-ui/icons';
import { Paper } from 'styles/Paper';
import {
  Tabs,
  Tab,
  ClickAwayListener,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
} from '@material-ui/core';

import { nick, nickId } from 'utils/nick';
import FieldBoolean from 'components/FieldBoolean';
import Records from './Records';
import TotalTimes from './TotalTimes';
import Personal from './Personal';
import Kinglist from './Kinglist';
import MultiRecords from './MultiRecords';
import Admin from './Admin';

const LevelPack = ({ name }) => {
  const isRehydrated = useStoreRehydrated();
  const {
    levelPackInfo,
    highlight,
    personalTimes,
    timesError,
    records,
    recordsLoading,
    setPersonalTimesLoading,
    personalKuski,
    settings: { highlightWeeks, showLegacyIcon, showLegacy },
  } = useStoreState(state => state.LevelPack);
  const {
    getLevelPackInfo,
    getHighlight,
    getPersonalTimes,
    setError,
    getRecords,
    setHighlightWeeks,
    toggleShowLegacyIcon,
    toggleShowLegacy,
  } = useStoreActions(actions => actions.LevelPack);
  const lastShowLegacy = useRef(showLegacy);
  const [openSettings, setOpenSettings] = useState(false);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    getLevelPackInfo(name);
    getRecords({ name, eolOnly: showLegacy ? 0 : 1 });
    getHighlight();
    const PersonalKuskiIndex = nick();
    if (PersonalKuskiIndex !== '') {
      getPersonalTimes({
        PersonalKuskiIndex,
        name,
        eolOnly: showLegacy ? 0 : 1,
      });
    }
  }, [name]);

  useEffect(() => {
    if (lastShowLegacy.current !== showLegacy) {
      lastShowLegacy.current = showLegacy;
      getRecords({ name, eolOnly: showLegacy ? 0 : 1 });
      if (personalKuski !== '') {
        getPersonalTimes({
          PersonalKuskiIndex: personalKuski,
          name,
          eolOnly: showLegacy ? 0 : 1,
        });
      }
    }
  }, [showLegacy]);

  if (!isRehydrated) return null;
  if (!levelPackInfo.LevelPackIndex) return null;
  return (
    <RootStyle>
      <Tabs
        variant="scrollable"
        scrollButtons="auto"
        value={tab}
        onChange={(e, t) => setTab(t)}
      >
        <Tab label="Records" />
        <Tab label="Total Times" />
        <Tab label="King list" />
        <Tab label="Personal" />
        <Tab label="Multi records" />
        {nickId() === levelPackInfo.KuskiIndex && <Tab label="Admin" />}
      </Tabs>
      <LevelPackName>
        <ShortNameStyled>{levelPackInfo.LevelPackName}</ShortNameStyled>{' '}
        <LongNameStyled>{levelPackInfo.LevelPackLongName}</LongNameStyled>
        <a href={`/dl/pack/${levelPackInfo.LevelPackName}`}>
          <Download>Download</Download>
        </a>
      </LevelPackName>
      <DescriptionStyle>{levelPackInfo.LevelPackDesc}</DescriptionStyle>
      <Settings>
        {openSettings ? (
          <ClickAwayListener onClickAway={() => setOpenSettings(false)}>
            <Paper>
              <SettingsHeader>
                <ClickCloseIcon onClick={() => setOpenSettings(false)} />
                <SettingsHeadline>Settings</SettingsHeadline>
              </SettingsHeader>
              <FormControl component="fieldset" focused={false}>
                <RadioButtonContainer>
                  <RadioButtonItem>
                    <FormLabel component="legend">
                      Highlight times newer than{' '}
                    </FormLabel>
                  </RadioButtonItem>
                  <RadioButtonItem>
                    <RadioGroup
                      aria-label="highlightWeeks"
                      value={highlightWeeks}
                      onChange={n => setHighlightWeeks(n.target.value)}
                      name="weeks"
                      row
                    >
                      <FormControlLabel
                        value={0}
                        checked={highlightWeeks === '0'}
                        label="0"
                        control={<Radio size="small" />}
                      />
                      <FormControlLabel
                        value={1}
                        checked={highlightWeeks === '1'}
                        label="1"
                        control={<Radio size="small" />}
                      />
                      <FormControlLabel
                        value={2}
                        checked={highlightWeeks === '2'}
                        label="2"
                        control={<Radio size="small" />}
                      />
                      <FormControlLabel
                        value={3}
                        checked={highlightWeeks === '3'}
                        label="3"
                        control={<Radio size="small" />}
                      />
                      <FormControlLabel
                        value={4}
                        checked={highlightWeeks === '4'}
                        label="4"
                        control={<Radio size="small" />}
                      />
                    </RadioGroup>
                  </RadioButtonItem>
                  <RadioButtonItem>
                    <FormLabel component="legend">weeks</FormLabel>
                  </RadioButtonItem>
                </RadioButtonContainer>
              </FormControl>
              {levelPackInfo.Legacy === 1 && (
                <>
                  <SettingItem>
                    <FieldBoolean
                      value={showLegacyIcon}
                      label="Show icon on legacy times"
                      onChange={() => toggleShowLegacyIcon()}
                    />
                  </SettingItem>
                  <SettingItem>
                    <FieldBoolean
                      value={showLegacy}
                      label="Show legacy times"
                      onChange={() => toggleShowLegacy()}
                    />
                  </SettingItem>
                </>
              )}
            </Paper>
          </ClickAwayListener>
        ) : (
          <ClickSettingsIcon onClick={() => setOpenSettings(true)} />
        )}
      </Settings>
      {tab === 0 && (
        <Records
          records={records}
          highlight={highlight}
          highlightWeeks={highlightWeeks}
          recordsLoading={recordsLoading}
          showLegacyIcon={showLegacyIcon}
        />
      )}
      {tab === 1 && (
        <TotalTimes
          levelPackIndex={levelPackInfo.LevelPackIndex}
          highlight={highlight}
          highlightWeeks={highlightWeeks}
        />
      )}
      {tab === 2 && (
        <Kinglist
          levelPackIndex={levelPackInfo.LevelPackIndex}
          highlight={highlight}
          highlightWeeks={highlightWeeks}
        />
      )}
      {tab === 3 && (
        <Personal
          timesError={timesError}
          setError={e => setError(e)}
          getTimes={newKuski =>
            getPersonalTimes({
              PersonalKuskiIndex: newKuski,
              name,
              eolOnly: showLegacy ? 0 : 1,
            })
          }
          times={personalTimes}
          highlight={highlight}
          highlightWeeks={highlightWeeks}
          records={records}
          setPersonalTimesLoading={setPersonalTimesLoading}
          showLegacyIcon={showLegacyIcon}
          kuski={personalKuski}
        />
      )}
      {tab === 4 && (
        <MultiRecords
          name={name}
          highlight={highlight}
          highlightWeeks={highlightWeeks}
        />
      )}
      {tab === 5 && <Admin records={records} LevelPack={levelPackInfo} />}
    </RootStyle>
  );
};

LevelPack.propTypes = {
  name: PropTypes.string.isRequired,
};

const RootStyle = styled.div`
  background: #fff;
  min-height: 100%;
  box-sizing: border-box;
`;

const LevelPackName = styled.div`
  font-size: 20px;
  padding: 10px;
`;

const ShortNameStyled = styled.span`
  font-weight: 500;
`;

const LongNameStyled = styled.span`
  color: #8c8c8c;
`;

const DescriptionStyle = styled.div`
  margin: 0 10px;
  font-size: 14px;
`;

const Download = styled.span`
  padding-left: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
`;

const Settings = styled.div`
  padding: 0 10px;
  margin-bottom: 26px;
  font-size: 14px;
`;

const SettingsHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  margin: 5px;
`;

const SettingsHeadline = styled.div`
  color: #8c8c8c;
  font-size: 20px;
`;

const SettingItem = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
  padding-bottom: 6px;
`;

const RadioButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 12px;
`;

const RadioButtonItem = styled.div`
  display: flex;
  float: left;
  margin-right: 15px;
`;

const ClickSettingsIcon = styled(SettingsIcon)`
  cursor: pointer;
`;

const ClickCloseIcon = styled(CloseIcon)`
  cursor: pointer;
`;

const FormLabel = styled.legend`
  color: rgba(0, 0, 0, 0.54);
  font-size: 1rem;
  letter-spacing: 0.00938em;
`;

export default LevelPack;
