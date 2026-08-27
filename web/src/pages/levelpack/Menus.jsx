import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { ExpandLess as CloseIcon } from '@material-ui/icons';
import {
  ClickAwayListener,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
} from '@material-ui/core';
import { Paper } from 'components/Paper';
import Button from 'components/Buttons';
import FieldBoolean from 'components/FieldBoolean';
import { Dropdown } from 'components/Inputs';
import { Row } from 'components/Containers';
import { KuskiAutoComplete } from 'components/AutoComplete';

const Menus = ({ name, hideFilter }) => {
  const [openSettings, setOpenSettings] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const {
    levelPackInfo,
    settings: { highlightWeeks, showLegacyIcon, showLegacy, showLogos },
    teams,
    countries,
    kuskis,
    team,
    country,
    kuskisFilter,
  } = useStoreState(state => state.LevelPack);

  const {
    setHighlightWeeks,
    toggleShowLegacyIcon,
    toggleShowLegacy,
    toggleShowLogos,
    getStats,
    setTeam,
    setCountry,
    setKuskisFilter,
    getRecordsOnly,
  } = useStoreActions(actions => actions.LevelPack);

  return (
    <Settings>
      {openSettings || openFilter ? (
        <>
          {openFilter && (
            <ClickAwayListener
              mouseEvent="onMouseUp"
              onClickAway={() => setOpenFilter(false)}
            >
              <Paper>
                <SettingsHeader onClick={() => setOpenFilter(false)}>
                  <ClickCloseIcon />
                  <SettingsHeadline>Filter</SettingsHeadline>
                </SettingsHeader>
                <Dropdown
                  name="Country"
                  options={countries}
                  selected={country}
                  width={200}
                  update={id => {
                    setTeam('');
                    setKuskisFilter([]);
                    setCountry(id);
                    getStats({
                      name,
                      eolOnly: showLegacy ? 0 : 1,
                      filterValue: id,
                      filter: 'country',
                    });
                    getRecordsOnly({
                      name,
                      eolOnly: showLegacy ? 0 : 1,
                      filterValue: id,
                      filter: 'country',
                    });
                  }}
                />
                <Dropdown
                  name="Team"
                  options={teams}
                  selected={team}
                  width={200}
                  update={id => {
                    setCountry('');
                    setKuskisFilter([]);
                    setTeam(id);
                    getStats({
                      name,
                      eolOnly: showLegacy ? 0 : 1,
                      filterValue: id,
                      filter: 'team',
                    });
                    getRecordsOnly({
                      name,
                      eolOnly: showLegacy ? 0 : 1,
                      filterValue: id,
                      filter: 'team',
                    });
                  }}
                />
                <Row b="Small" l="Small" t="Small">
                  <AutoCompleteCon>
                    <KuskiAutoComplete
                      list={kuskis}
                      selected={kuskisFilter}
                      onChange={(ids, newValue) => {
                        setKuskisFilter(newValue);
                      }}
                    />
                  </AutoCompleteCon>
                  <Button
                    naked
                    onClick={() => {
                      setCountry('');
                      setTeam('');
                      getStats({
                        name,
                        eolOnly: showLegacy ? 0 : 1,
                        filterValue: kuskisFilter
                          .map(k => k.KuskiIndex)
                          .join(','),
                        filter: 'kuski',
                      });
                      getRecordsOnly({
                        name,
                        eolOnly: showLegacy ? 0 : 1,
                        filterValue: kuskisFilter
                          .map(k => k.KuskiIndex)
                          .join(','),
                        filter: 'kuski',
                      });
                    }}
                  >
                    Filter by selected kuskis
                  </Button>
                </Row>
                <Row b="Small" l="Small">
                  <Button
                    icon="close"
                    onClick={() => {
                      if (country || team || kuskisFilter.length > 0) {
                        getStats({ name, eolOnly: showLegacy ? 0 : 1 });
                        getRecordsOnly({ name, eolOnly: showLegacy ? 0 : 1 });
                      }
                      setCountry('');
                      setTeam('');
                      setKuskisFilter([]);
                    }}
                    naked
                  >
                    Clear all
                  </Button>
                </Row>
              </Paper>
            </ClickAwayListener>
          )}
          {openSettings && (
            <ClickAwayListener onClickAway={() => setOpenSettings(false)}>
              <Paper>
                <SettingsHeader onClick={() => setOpenSettings(false)}>
                  <ClickCloseIcon />
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
                        onChange={n =>
                          setHighlightWeeks(Number(n.target.value))
                        }
                        name="weeks"
                        row
                      >
                        <FormControlLabel
                          value={0}
                          checked={highlightWeeks === 0}
                          label="0"
                          control={<Radio size="small" />}
                        />
                        <FormControlLabel
                          value={1}
                          checked={highlightWeeks === 1}
                          label="1"
                          control={<Radio size="small" />}
                        />
                        <FormControlLabel
                          value={2}
                          checked={highlightWeeks === 2}
                          label="2"
                          control={<Radio size="small" />}
                        />
                        <FormControlLabel
                          value={3}
                          checked={highlightWeeks === 3}
                          label="3"
                          control={<Radio size="small" />}
                        />
                        <FormControlLabel
                          value={4}
                          checked={highlightWeeks === 4}
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
                <SettingItem>
                  <FieldBoolean
                    value={showLogos}
                    label="Show team logos"
                    onChange={() => toggleShowLogos()}
                  />
                </SettingItem>
              </Paper>
            </ClickAwayListener>
          )}
        </>
      ) : (
        <>
          <Button icon="settings" onClick={() => setOpenSettings(true)} naked>
            Settings
          </Button>
          {hideFilter ? null : (
            <Button icon="filter" onClick={() => setOpenFilter(true)} naked>
              Filter
            </Button>
          )}
          <Button
            icon="refresh"
            onClick={() => {
              getStats({ name, eolOnly: showLegacy ? 0 : 1 });
              getRecordsOnly({ name, eolOnly: showLegacy ? 0 : 1 });
            }}
            naked
          >
            Refresh
          </Button>
        </>
      )}
    </Settings>
  );
};

const AutoCompleteCon = styled.div`
  width: 25%;
  margin-right: ${p => p.theme.padSmall};
`;

const Settings = styled.div`
  padding: 0 10px;
  font-size: 14px;
  width: 50%;
  margin-top: ${p => p.theme.padSmall};
`;

const SettingsHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  margin: 5px;
  cursor: pointer;
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

const ClickCloseIcon = styled(CloseIcon)`
  cursor: pointer;
`;

const FormLabel = styled.legend`
  color: ${p => p.theme.lightTextColor};
  font-size: 1rem;
  letter-spacing: 0.00938em;
`;

export default Menus;
