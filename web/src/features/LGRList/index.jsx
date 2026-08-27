import React, { useState, useEffect } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import styled from '@emotion/styled';
import LGRListItem from 'components/LGRListItem';
import LGRListCard from 'components/LGRListCard';
import TagFilter from 'components/TagFilter';
import Loading from 'components/Loading';
import { ListContainer, ListHeader, ListCell } from 'components/List';
import ListIcon from '@material-ui/icons/List';
import AppsIcon from '@material-ui/icons/Apps';
import SortByAlphaIcon from '@material-ui/icons/SortByAlpha';
import SortByAlphaOutlinedIcon from '@material-ui/icons/SortByAlphaOutlined';
import GetAppIcon from '@material-ui/icons/GetApp';
import GetAppOutlinedIcon from '@material-ui/icons/GetAppOutlined';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

const LGRList = () => {
  const { lgrs, settings, tagOptions } = useStoreState(state => state.LGRList);
  const { getLGRs, setSettings, getTagOptions } = useStoreActions(
    actions => actions.LGRList,
  );
  const [includedTags, setIncludedTags] = useState([]);
  const [excludedTags, setExcludedTags] = useState([]);

  useEffect(() => {
    getLGRs();
    getTagOptions();
  }, []);

  const sortBy = settings.sortBy ? settings.sortBy : 'LGRName';
  const sorts = {
    LGRName: (a, b) =>
      a.LGRName > b.LGRName ? 1 : a.LGRName < b.LGRName ? -1 : 0,
    Downloads: (a, b) => b.Downloads - a.Downloads,
  };
  const filterIncludedLgrs = lgrs.filter(lgr =>
    includedTags.every(tag =>
      lgr.Tags.some(lgr_tag => lgr_tag.TagIndex === tag.TagIndex),
    ),
  );
  const filterExcludedLgrs = filterIncludedLgrs.filter(
    lgr =>
      !excludedTags.some(tag =>
        lgr.Tags.some(lgr_tag => lgr_tag.TagIndex === tag.TagIndex),
      ),
  );
  const sortedLgrs = filterExcludedLgrs.toSorted(sorts[sortBy]);

  return (
    <>
      <StickyContainer>
        <TagFilter
          tagOptions={tagOptions}
          selectedTags={includedTags}
          onSelectedTagsChange={(_event, newValue) => {
            setIncludedTags(newValue);
          }}
          excludedTags={excludedTags}
          onExcludedTagsChange={(_event, newValue) => {
            setExcludedTags(newValue);
          }}
        />
        <ToggleButtonGroup
          value={settings.sortBy}
          size="small"
          exclusive
          style={{ alignSelf: 'center', marginRight: '12px' }}
          onChange={(ev, value) => setSettings({ sortBy: value })}
        >
          <ToggleButton title="Sort by name" value="LGRName">
            {settings.sortBy === 'LGRName' ? (
              <SortByAlphaIcon fontSize="small" />
            ) : (
              <SortByAlphaOutlinedIcon fontSize="small" />
            )}
          </ToggleButton>
          <ToggleButton title="Sort by downloads" value="Downloads">
            {settings.sortBy === 'Downloads' ? (
              <GetAppIcon fontSize="small" />
            ) : (
              <GetAppOutlinedIcon fontSize="small" />
            )}
          </ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup
          value={settings.grid}
          size="small"
          exclusive
          style={{ alignSelf: 'center', marginRight: '12px' }}
          onChange={(ev, value) => setSettings({ grid: value })}
        >
          <ToggleButton title="List view" value={false}>
            <ListIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton title="Thumbnail view" value={true}>
            <AppsIcon fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>
      </StickyContainer>
      {!lgrs ? (
        <Loading />
      ) : (
        <>
          {!settings.grid && (
            <ListContainerWhite>
              <ListHeader>
                <ListCell>Uploaded</ListCell>
                <ListCell>Name</ListCell>
                <ListCell>Uploader</ListCell>
                <ListCell>Description</ListCell>
                <ListCell right>Downloads</ListCell>
                <ListCell>Tags</ListCell>
              </ListHeader>
              {sortedLgrs.map(lgr => {
                return <LGRListItem lgr={lgr} key={lgr.LGRIndex} />;
              })}
            </ListContainerWhite>
          )}
          {settings.grid && (
            <CardGrid>
              {sortedLgrs.map(lgr => {
                return <LGRListCard lgr={lgr} key={lgr.LGRIndex} />;
              })}
            </CardGrid>
          )}
        </>
      )}
    </>
  );
};

const ListContainerWhite = styled(ListContainer)`
  background: ${p => p.theme.paperBackground};
`;

const StickyContainer = styled.div`
  background: ${p => p.theme.pageBackground};
  position: ${p => (p.nonsticky ? 'relative' : 'sticky')};
  display: flex;
  justify-content: space-between;
  top: ${p => (p.nonsticky ? '0' : '52px')};
  z-index: 10;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 12px;
  padding: 12px;
`;

export default LGRList;
