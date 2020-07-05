import React, { useState, useEffect } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import withStyles from 'isomorphic-style-loader/withStyles';
import { useStoreState, useStoreActions } from 'easy-peasy';
import SettingsIcon from '@material-ui/icons/Settings';
import CloseIcon from '@material-ui/icons/Close';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import OutsideClickHandler from 'react-outside-click-handler';
import SaveAlt from '@material-ui/icons/SaveAlt';

import { nick } from 'utils/nick';
import { Number } from 'components/Selectors';
import Records from './Records';
import TotalTimes from './TotalTimes';
import Personal from './Personal';

// eslint-disable-next-line css-modules/no-unused-class
import s from './LevelPack.css';

const GET_LEVELPACK = gql`
  query($name: String!) {
    getLevelPack(LevelPackName: $name) {
      LevelPackIndex
      LevelPackLongName
      LevelPackName
      LevelPackDesc
      KuskiData {
        Kuski
      }
      Levels {
        LevelIndex
        LevelPackLevelIndex
        Level {
          LevelName
          LongName
        }
      }
    }
  }
`;

const LevelPack = ({ name }) => {
  const { highlight, personalTimes, timesError, records } = useStoreState(
    state => state.LevelPack,
  );
  const {
    getHighlight,
    getPersonalTimes,
    setError,
    getRecords,
  } = useStoreActions(actions => actions.LevelPack);
  const [openSettings, setOpenSettings] = useState(false);
  const [highlightWeeks, setHighlightWeeks] = useState(1);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    getRecords(name);
    getHighlight();
    const PersonalKuskiIndex = nick();
    if (PersonalKuskiIndex !== '') {
      getPersonalTimes({ PersonalKuskiIndex, name });
    }
  }, [name]);

  return (
    <div className={s.root}>
      <Query query={GET_LEVELPACK} variables={{ name }}>
        {({ data: { getLevelPack }, loading, error }) => {
          if (loading) return null;
          if (error) return <div>something went wrong</div>;
          return (
            <>
              <Tabs value={tab} onChange={(e, t) => setTab(t)}>
                <Tab label="Records" />
                <Tab label="Total Times" />
                <Tab label="Personal" />
              </Tabs>
              <div className={s.levelPackName}>
                <span className={s.shortName}>
                  {getLevelPack.LevelPackName}
                </span>{' '}
                <span className={s.longName}>
                  {getLevelPack.LevelPackLongName}
                </span>
                <a href={`/dl/pack/${getLevelPack.LevelPackName}`}>
                  <Download>
                    <SaveAlt />
                  </Download>
                </a>
              </div>
              <div className={s.description}>{getLevelPack.LevelPackDesc}</div>
              <Settings>
                {openSettings ? (
                  <OutsideClickHandler
                    onOutsideClick={() => setOpenSettings(false)}
                  >
                    <Paper>
                      <SettingsHeader>
                        <ClickCloseIcon
                          onClick={() => setOpenSettings(false)}
                        />
                        <SettingsHeadline>Settings</SettingsHeadline>
                      </SettingsHeader>
                      <SettingItem>
                        Highlight times newer than{' '}
                        <Number
                          number={highlightWeeks}
                          updated={n => setHighlightWeeks(n)}
                          name="weeks"
                          numbers={[0, 1, 2, 3, 4]}
                        />
                      </SettingItem>
                    </Paper>
                  </OutsideClickHandler>
                ) : (
                  <ClickSettingsIcon onClick={() => setOpenSettings(true)} />
                )}
              </Settings>
              {tab === 0 && (
                <Records
                  records={records}
                  highlight={highlight}
                  highlightWeeks={highlightWeeks}
                />
              )}
              {tab === 1 && (
                <TotalTimes
                  levelPackIndex={getLevelPack.LevelPackIndex}
                  highlight={highlight}
                  highlightWeeks={highlightWeeks}
                />
              )}
              {tab === 2 && (
                <Personal
                  timesError={timesError}
                  setError={e => setError(e)}
                  getTimes={newKuski =>
                    getPersonalTimes({ PersonalKuskiIndex: newKuski, name })
                  }
                  times={personalTimes}
                  highlight={highlight}
                  highlightWeeks={highlightWeeks}
                />
              )}
            </>
          );
        }}
      </Query>
    </div>
  );
};

LevelPack.propTypes = {
  name: PropTypes.string.isRequired,
};

const Download = styled.span`
  padding-left: 10px;
  cursor: pointer;
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
  margin: 2px;
`;

const SettingsHeadline = styled.div`
  color: #8c8c8c;
  font-size: 20px;
`;

const SettingItem = styled.div`
  display: flex;
  align-items: center;
  margin: 6px;
  padding-bottom: 6px;
`;

const ClickSettingsIcon = styled(SettingsIcon)`
  cursor: pointer;
`;

const ClickCloseIcon = styled(CloseIcon)`
  cursor: pointer;
`;

export default withStyles(s)(LevelPack);
