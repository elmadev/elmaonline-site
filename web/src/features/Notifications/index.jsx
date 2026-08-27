import React, { useEffect, Fragment } from 'react';
import LocalTime from 'components/LocalTime';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { ListRow, ListCell, ListContainer } from 'components/List';
import Avatar from '@material-ui/core/Avatar';
import CommentIcon from '@material-ui/icons/Comment';
import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import LooksOneIcon from '@material-ui/icons/LooksOne';
import Badge from '@material-ui/core/Badge';
import styled from '@emotion/styled';
import Link from 'components/Link';
import { useState } from 'react';
import { Paper, TablePagination } from '@material-ui/core';

const Notifications = ({
  defaultPage = 0,
  defaultPageSize = 25,
  showPagination = true,
}) => {
  const [page, setPage] = useState(defaultPage);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const { notifications, seenAt } = useStoreState(state => state.Notifications);
  const { getNotifications, markSeen } = useStoreActions(
    actions => actions.Notifications,
  );
  const { getNotificationsCount } = useStoreActions(actions => actions.Login);

  const paginateNotifications = (notificationList, page, pageSize) => {
    return notificationList.slice(page * pageSize, page * pageSize + pageSize);
  };

  useEffect(() => {
    getNotifications();
    getNotificationsCount();
  }, [seenAt]);

  useEffect(() => {
    const timer = setTimeout(() => {
      markSeen();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleChangeRowsPerPage = event => {
    setPage(0);
    setPageSize(event.target.value);
  };

  const getIcon = type => {
    switch (type) {
      case 'comment':
      case 'lgr_comment':
        return (
          <CommentAvatar>
            <CommentIcon />
          </CommentAvatar>
        );
      case 'beaten':
        return (
          <BeatenAvatar>
            <TrendingDownIcon />
          </BeatenAvatar>
        );
      case 'besttime':
        return (
          <BestTimeAvatar>
            <LooksOneIcon />
          </BestTimeAvatar>
        );
      case 'news':
        return (
          <CommentAvatar>
            <FormatAlignLeftIcon />
          </CommentAvatar>
        );
      default:
        break;
    }
  };

  const getText = n => {
    const meta = JSON.parse(n.Meta);

    switch (n.Type) {
      case 'comment':
        return (
          <div>
            {meta.kuski} added a comment to your replay{' '}
            <Link
              to={`/r/${meta.replayUUID}/${meta.replayName.replace(
                '.rec',
                '',
              )}`}
            >
              {meta.replayName}
            </Link>{' '}
            <i>"{meta.Text}"</i>
          </div>
        );
      case 'lgr_comment':
        return (
          <div>
            {meta.kuski} added a comment to your lgr{' '}
            <Link to={`/lgr/${meta.LGRName}`}>{meta.LGRName}</Link>{' '}
            <i>"{meta.Text}"</i>
          </div>
        );
      case 'beaten':
        return (
          <div>
            {meta.kuski} crushed your record in level{' '}
            <Link to={`/levels/${meta.levelIndex}`}>{meta.level}</Link>
          </div>
        );
      case 'besttime':
        return (
          <div>
            [
            {meta.levPacks.map((pack, index) => (
              <Fragment key={pack.LevelPackName}>
                <Link to={`/levels/packs/${pack.LevelPackName}`}>
                  {pack.LevelPackName}
                </Link>
                {meta.levPacks.length > index + 1 && ', '}
              </Fragment>
            ))}
            ] {meta.kuski} got record in level{' '}
            <Link to={`/levels/${meta.levelIndex}`}>{meta.level}</Link> with
            time {meta.time}
          </div>
        );
      case 'news':
        return (
          <div>
            {meta.kuski} posted a news article{' '}
            <Link to="/">"{meta.Headline}"</Link>
          </div>
        );
      default:
        break;
    }
  };

  return (
    <Paper>
      <ListContainer>
        {paginateNotifications(notifications, page, pageSize).map(n => {
          return (
            <ListRow key={n.NotificationIndex} verticalAlign="middle">
              <ListCell width={60} verticalAlign="middle" textAlign="center">
                <Badge
                  color="secondary"
                  overlap="rectangular"
                  badgeContent={!n.SeenAt ? 'new' : null}
                >
                  {getIcon(n.Type)}
                </Badge>
              </ListCell>
              <ListCell>
                <Written>
                  <LocalTime
                    date={n.CreatedAt}
                    format="eee d MMM yyyy HH:mm"
                    parse="X"
                  />
                </Written>
                {getText(n)}
              </ListCell>
            </ListRow>
          );
        })}
      </ListContainer>
      {showPagination && (
        <TablePagination
          style={{ width: '600px' }}
          component="div"
          count={notifications.length}
          rowsPerPage={pageSize}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Paper>
  );
};

const Written = styled.span`
  color: ${p => p.theme.lightTextColor};
`;

const CommentAvatar = styled(Avatar)`
  background-color: ${p => p.theme.secondary} !important;
`;

const BeatenAvatar = styled(Avatar)`
  background-color: ${p => p.theme.aborted} !important;
`;

const BestTimeAvatar = styled(Avatar)`
  background-color: ${p => p.theme.primaryLight} !important;
`;

export default Notifications;
