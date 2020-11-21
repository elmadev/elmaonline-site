import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useStoreState, useStoreActions, useStoreRehydrated } from 'easy-peasy';
import { sortBy, filter } from 'lodash';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import { ListContainer, ListHeader, ListCell, ListRow } from 'styles/List';

import RecListItem from 'components/RecListItem';
import historyRefresh from 'utils/historyRefresh';

const widths = { Replay: 200, Time: 100, Level: null, By: null };

const RecList = ({ currentUUID, columns, horizontalMargin, LevelIndex }) => {
  const isRehydrated = useStoreRehydrated();
  const {
    show: { showTAS, showDNF, showBug, showNitro },
    loading,
    replays,
  } = useStoreState(state => state.RecList);
  const {
    setShowTAS,
    setShowDNF,
    setShowBug,
    setShowNitro,
    getReplays,
  } = useStoreActions(actions => actions.RecList);

  useEffect(() => {
    getReplays(LevelIndex);
  }, [LevelIndex]);

  const isSelected = uuid => {
    return currentUUID === uuid;
  };

  const handleOpenReplay = uuid => {
    historyRefresh.push({
      pathname: `/r/${uuid}`,
    });
  };

  const filterFunction = o => {
    let show = true;
    if (!showTAS && o.TAS) {
      show = false;
    }
    if (!showDNF && !o.Finished) {
      show = false;
    }
    if (!showBug && o.Bug) {
      show = false;
    }
    if (!showNitro && o.Nitro) {
      show = false;
    }
    return show;
  };
  if (!isRehydrated) return null;
  return (
    <>
      <div>
        <FormControlLabel
          control={
            <Checkbox
              checked={showTAS}
              onChange={() => setShowTAS(!showTAS)}
              value="ShowTAS"
              color="primary"
            />
          }
          label="Show TAS"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={showDNF}
              onChange={() => setShowDNF(!showDNF)}
              value="ShowDNF"
              color="primary"
            />
          }
          label="Show Unfinished"
        />
      </div>
      <div>
        <FormControlLabel
          control={
            <Checkbox
              checked={showBug}
              onChange={() => setShowBug(!showBug)}
              value="showBug"
              color="primary"
            />
          }
          label="Show Bugged"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={showNitro}
              onChange={() => setShowNitro(!showNitro)}
              value="showNitro"
              color="primary"
            />
          }
          label="Show Modded"
        />
      </div>
      <ListContainer
        horizontalMargin={`${horizontalMargin}px`}
        width={`calc(100% - ${horizontalMargin * 2}px)`}
      >
        <ListHeader>
          {columns.map(c => (
            <ListCell ListCell width={widths[c]} key={c} right={c === 'Time'}>
              {c}
            </ListCell>
          ))}
        </ListHeader>
        {loading ? (
          <ListRow>
            <ListCell>Loading...</ListCell>
          </ListRow>
        ) : (
          sortBy(filter(replays, filterFunction), ['ReplayTime']).map(i => (
            <RecListItem
              key={i.ReplayIndex}
              replay={i}
              openReplay={uuid => handleOpenReplay(uuid)}
              selected={isSelected(i.UUID)}
              columns={columns}
            />
          ))
        )}
      </ListContainer>
    </>
  );
};

RecList.propTypes = {
  currentUUID: PropTypes.string,
  columns: PropTypes.arrayOf(PropTypes.string),
  horizontalMargin: PropTypes.number,
  LevelIndex: PropTypes.number.isRequired,
};

RecList.defaultProps = {
  currentUUID: null,
  columns: ['Replay', 'Level', 'Time', 'By'],
  horizontalMargin: 0,
};

export default RecList;
