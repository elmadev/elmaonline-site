import { useState } from 'react';
import { ListCell, ListContainer, ListHeader } from 'components/List';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';

type Order = 'asc' | 'desc';

type SortableHeader = {
  name: string;
  sort?: boolean;
  right?: boolean;
  width?: number;
  minWidth?: number;
};

type SortableListProps = {
  children?: React.ReactNode;
  chin?: boolean;
  horizontalMargin?: string;
  width?: string;
  flex?: boolean;
  headers: SortableHeader[];
  sort?: (sorting: { header: string; sort: Order }) => void;
  ascFirst?: boolean;
  defaultSort?: string;
};

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
}: SortableListProps) => {
  const [sortHeader, setSortHeader] = useState(defaultSort || '');
  const [order, setOrder] = useState<Order>(ascFirst ? 'asc' : 'desc');

  const doSort = (h: string) => {
    if (sort) {
      let newOrder: Order = ascFirst ? 'asc' : 'desc';
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
              right={Boolean(h.right)}
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
