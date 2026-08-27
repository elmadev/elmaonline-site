import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { ListCell, ListRow } from 'components/List';
import { Level } from 'components/Names';
import Kuski from 'components/Kuski';
import Time from 'components/Time';
import Link from 'components/Link';
import Tags from 'components/Tags';
import { AddBox, IndeterminateCheckBox } from '@material-ui/icons';
import { useLocation } from '@tanstack/react-router';
import { formatDistanceStrict } from 'date-fns';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const RecListItem = ({
  replay,
  selected = false,
  columns = ['Replay', 'Level', 'Time', 'By'],
  mergable = false,
}) => {
  const [isHover, setHover] = useState(false);
  const location = useLocation();
  const { merge } = location.search;

  const url = `/r/${replay.UUID}/${replay.RecFileName.replace('.rec', '')}`;

  const updateUrl = (unmerge = false) => {
    if (unmerge) {
      return merge?.includes(';')
        ? merge.startsWith(`${replay.UUID};`)
          ? `${location.pathname}?merge=${merge.replace(`${replay.UUID};`, '')}`
          : `${location.pathname}?merge=${merge.replace(`;${replay.UUID}`, '')}`
        : location.pathname;
    }
    return merge
      ? `${location.pathname}?merge=${merge};${replay.UUID}`
      : `${location.pathname}?merge=${replay.UUID}`;
  };

  const isMobile = useMediaQuery('(max-width: 1024px)');

  const getTags = () => {
    return replay.Tags.map(tag => tag.Name);
  };

  return (
    <ListRow
      key={`${replay.ReplayIndex}${replay.TimeIndex}`}
      selected={selected}
      onHover={hover => mergable && setHover(hover)}
    >
      {columns.indexOf('Uploaded') !== -1 && (
        <ListCell width={170} to={url}>
          {formatDistanceStrict(replay.Uploaded * 1000, new Date(), {
            addSuffix: true,
          })}
        </ListCell>
      )}
      {columns.indexOf('Replay') !== -1 && (
        <ListCell width={200} to={url}>
          {replay.RecFileName}
        </ListCell>
      )}
      {columns.indexOf('Level') !== -1 && (
        <ListCell width={100}>
          <Level LevelIndex={replay.LevelIndex} LevelData={replay.LevelData} />
        </ListCell>
      )}
      {columns.indexOf('Time') !== -1 && (
        <ListCell right to={url}>
          {replay.BattleIndex ? (
            <Time time={replay.ReplayTime / 10} apples={replay.Apples} />
          ) : (
            <Time thousands time={replay.ReplayTime} />
          )}
        </ListCell>
      )}
      {columns.indexOf('By') !== -1 && (
        <ListCell>
          {replay.DrivenByData ? (
            <Kuski kuskiData={replay.DrivenByData} />
          ) : (
            <div>{replay.DrivenByText || 'Unknown'}</div>
          )}
        </ListCell>
      )}
      {columns.indexOf('Unlisted') !== -1 && (
        <ListCell to={url}>{replay.Unlisted === 1 ? 'Yes' : ''}</ListCell>
      )}
      {columns.indexOf('Rating') !== -1 && (
        <ListCell to={url}>{replay.ratingAvg}</ListCell>
      )}

      {columns.indexOf('Views') !== -1 && <ListCell>{replay.Views}</ListCell>}

      {columns.indexOf('Tags') !== -1 && (
        <ListCell width={300} to={url}>
          <Tags tags={getTags()} />
        </ListCell>
      )}
      {mergable && (isMobile || isHover) && (
        <MergeContainer title={selected ? 'Unmerge replay' : 'Merge replay'}>
          {selected ? (
            <>
              {merge?.includes(replay.UUID) && (
                <Link to={updateUrl(true)}>
                  <IndeterminateCheckBox />
                </Link>
              )}
            </>
          ) : (
            <Link to={updateUrl()}>
              <AddBox />
            </Link>
          )}
        </MergeContainer>
      )}
    </ListRow>
  );
};

export const MergeContainer = styled.div`
  position: absolute;
  right: 0;
  margin: 7px;
  background: white;
  border-radius: 4px;
`;

RecListItem.propTypes = {
  replay: PropTypes.shape({
    ReplayIndex: PropTypes.number.isRequired,
    LevelIndex: PropTypes.number.isRequired,
    UploadedBy: PropTypes.number.isRequired,
    ReplayTime: PropTypes.number,
    TAS: PropTypes.number,
    Bug: PropTypes.number,
    Nitro: PropTypes.number,
    Finished: PropTypes.number,
    DrivenBy: PropTypes.number,
    DrivenByText: PropTypes.string,
  }).isRequired,
  selected: PropTypes.bool,
  columns: PropTypes.arrayOf(PropTypes.string),
  mergable: PropTypes.bool,
};

export default RecListItem;
