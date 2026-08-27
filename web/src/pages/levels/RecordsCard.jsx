import React, { useState } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Header from 'components/Header';
import RecentRecords from 'components/RecentRecords';
import CardActions from '@material-ui/core/CardActions';
import Button from 'components/Buttons';
import { RecentBestRecords, useQueryAlt } from 'api';
import Loading from 'components/Loading';

const RecordsCard = () => {
  const [expanded, setExpanded] = useState(false);

  // going too high on either (but I think especially days)
  // can cause performance problems.
  const days = 14;
  const limit = 100;

  const { data: records, isLoading } = useQueryAlt(
    ['RecentBestRecords', days],
    async () => RecentBestRecords(days, limit),
  );

  const previewCount = limit;

  const show = records
    ? expanded
      ? records
      : records.slice(0, previewCount)
    : [];

  const countMore = records ? records.length - previewCount : 0;

  return (
    <Card>
      <CardContent title="Records driven during battles are omitted.">
        <Header h2>
          Top {limit} Non-Battle Records Driven in the Last {days} Days
        </Header>
        <div>
          Ordered by the current overall playtime by all kuskis in the level.
        </div>
        <div>
          Times shown were records when they were driven (and sometimes still
          are).
        </div>
        <div>
          Records driven on battle levels after the battle ends are shown.
        </div>
        <br />
        {records && <RecentRecords records={show} />}
        {isLoading && <Loading />}
      </CardContent>
      {countMore > 0 && (
        <CardActions>
          <Button onClick={() => setExpanded(!expanded)} naked little>
            {expanded && <span>Show less</span>}
            {!expanded && <span>Show {countMore} more</span>}
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default RecordsCard;
