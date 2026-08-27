import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { sortBy, filter, intersectionBy } from 'lodash';
import { ListContainer, ListHeader, ListCell, ListRow } from 'components/List';
import Header from 'components/Header';
import RecListItem from 'components/RecListItem';
import TagFilter from 'components/TagFilter';
import { Row } from 'components/Containers';

const widths = { Replay: 200, Time: 100, Level: null, By: null };

const RecList = ({
  currentUUID = null,
  columns = ['Replay', 'Level', 'Time', 'By'],
  horizontalMargin = 0,
  LevelIndex,
  mergable = false,
}) => {
  const {
    loading,
    replays,
    tagOptions,
    tags: { includedTags, excludedTags },
  } = useStoreState(state => state.RecList);
  const {
    getTagOptions,
    getReplays,
    tags: { setIncludedTags, setExcludedTags },
  } = useStoreActions(actions => actions.RecList);

  useEffect(() => {
    getReplays(LevelIndex);
    getTagOptions();
  }, [LevelIndex]);

  const isSelected = uuid => {
    if (!currentUUID) {
      return false;
    }
    return currentUUID.indexOf(uuid) !== -1;
  };

  const filterByTags = i => {
    return (
      (includedTags.length === 0 ||
        intersectionBy(i.Tags, includedTags, 'TagIndex').length >
          includedTags.length - 1) &&
      (excludedTags.length === 0 ||
        intersectionBy(i.Tags, excludedTags, 'TagIndex').length === 0)
    );
  };

  return (
    <>
      <Header h3>Filter</Header>
      <Row>
        <TagFilter
          tagOptions={tagOptions}
          selectedTags={includedTags}
          onSelectedTagsChange={(_event, newValue) => setIncludedTags(newValue)}
          excludedTags={excludedTags}
          onExcludedTagsChange={(_event, newValue) => setExcludedTags(newValue)}
        />
      </Row>
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
          sortBy(filter(replays, filterByTags), ['ReplayTime']).map(i => (
            <RecListItem
              key={`${i.ReplayIndex}${i.TimeIndex}`}
              replay={i}
              selected={isSelected(i.UUID)}
              columns={columns}
              mergable={mergable}
            />
          ))
        )}
      </ListContainer>
    </>
  );
};

RecList.propTypes = {
  currentUUID: PropTypes.arrayOf(PropTypes.string),
  columns: PropTypes.arrayOf(PropTypes.string),
  horizontalMargin: PropTypes.number,
  LevelIndex: PropTypes.number.isRequired,
};

export default RecList;
