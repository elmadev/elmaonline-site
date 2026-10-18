import React, { useState } from 'react';
import { ListCell, ListContainer, ListHeader } from 'components/List';
import { ArrowDropDown, ArrowDropUp } from '@material-ui/icons';

export const SortableList = ({
  children,
  chin,
  horizontalMargin,
  width,
  flex,
  headers,
  sort,
  ascFirst,
  defaultSort,
}) => {
  const [sortHeader, setSortHeader] = useState(defaultSort || '');
  const [order, setOrder] = useState(ascFirst ? 'asc' : 'desc');

  const doSort = h => {
    if (sort) {
      let newOrder = ascFirst ? 'asc' : 'desc';
      if (h === sortHeader) {
        newOrder = order === 'asc' ? 'desc' : 'asc';
      }
      setOrder(newOrder);
      setSortHeader(h);
      sort({ header: h, sort: newOrder });
    }
  };

  return (
    <ListContainer
      chin={chin}
      horizontalMargin={horizontalMargin}
      width={width}
      flex={flex}
    >
      <ListHeader>
        {headers.length > 0 &&
          headers.map(h => (
            <ListCell
              key={h.name}
              whiteSpace="nowrap"
              right={h.right || null}
              width={h.width || null}
              minWidth={h.minWidth || undefined}
              onClick={() => h.sort && doSort(h.name)}
            >
              {sortHeader === h.name && (
                <>{order === 'asc' ? <ArrowDropUp /> : <ArrowDropDown />}</>
              )}
              {h.name}
            </ListCell>
          ))}
      </ListHeader>
      {children}
    </ListContainer>
  );
};

export default SortableList;
