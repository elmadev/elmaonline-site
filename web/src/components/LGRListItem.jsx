import React from 'react';
import { formatDistanceStrict } from 'date-fns';
import { ListCell, ListRow } from 'components/List';
import Tags from 'components/Tags';
import Kuski from 'components/Kuski';
import config from 'config';

const LGRListItem = ({ lgr }) => {
  const url = `/lgr/${lgr.LGRName}`;
  const downloadLink = `${config.api}lgr/get/${lgr.LGRName}?dl`;
  return (
    <ListRow key={`${lgr.LGRIndex}`}>
      <ListCell to={url}>
        {formatDistanceStrict(lgr.Added * 1000, new Date(), {
          addSuffix: true,
        })}
      </ListCell>
      <ListCell to={downloadLink}>{lgr.LGRName}.lgr</ListCell>
      <ListCell>
        <Kuski kuskiData={lgr.KuskiData} />
      </ListCell>
      <ListCell to={url}>{lgr.LGRDesc}</ListCell>
      <ListCell to={url} right>
        {lgr.Downloads}
      </ListCell>
      <ListCell>
        <Tags tags={lgr.Tags.map(tag => tag.Name)} />
      </ListCell>
    </ListRow>
  );
};

export default LGRListItem;
