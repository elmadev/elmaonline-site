import React, { useEffect } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import styled from '@emotion/styled';
import Pagination from '@material-ui/lab/Pagination';
import {
  ListContainer,
  ListCell,
  ListHeader,
  ListRow,
} from '../../components/List';
import { formatDistanceStrict } from 'date-fns';
import Link from 'components/Link';
import Kuski from 'components/Kuski';
import Time from 'components/Time';
import { useMediaQuery } from '@material-ui/core';
import { useLocation, useNavigate } from '@tanstack/react-router';

const ReplayCommentArchive = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = location.search;
  const page = +query.page > 1 ? +query.page : 1;
  const pageSize = 20;
  const narrowCols = useMediaQuery('(max-width: 980px)');
  const { comments } = useStoreState(store => store.ReplayCommentArchive);
  const { fetchComments } = useStoreActions(
    store => store.ReplayCommentArchive,
  );
  const [rows, countAll] = comments;
  const pages = Math.ceil(countAll / pageSize);

  useEffect(() => {
    fetchComments([pageSize, (page - 1) * pageSize]);
  }, [page]);

  return (
    <Root>
      <ListContainer>
        <ListHeader>
          <ListCell width={narrowCols ? 250 : 400}>Replay</ListCell>
          <ListCell>Comment</ListCell>
        </ListHeader>
        {rows.map((c, index) => {
          const replay = c.Replay || {};
          const driver = replay.DrivenByData || replay.UploadedByData || {};
          const commenter = c.KuskiData || {};

          const uploadedAt = formatDistanceStrict(
            replay.Uploaded * 1000,
            new Date(),
            {
              addSuffix: true,
            },
          );

          const commentedAt = formatDistanceStrict(
            c.Entered * 1000,
            new Date(),
            {
              addSuffix: true,
            },
          );

          return (
            <ListRow key={index}>
              <ListCell title={uploadedAt}>
                <Kuski kuskiData={driver} flag={true} team={true} />
                <Br />
                <Link title={replay.UUID} to={`/r/${replay.UUID}`}>
                  {replay.RecFileName}
                </Link>
                {` - `}
                <Time thousands time={replay.ReplayTime} />
              </ListCell>
              <ListCell>
                <Kuski kuskiData={commenter} flag={true} />
                {` - ${commentedAt}`}
                <Br />
                {c.Text}
              </ListCell>
            </ListRow>
          );
        })}
      </ListContainer>

      <Pag>
        <Pagination
          count={pages}
          onChange={(event, value) =>
            navigate({ to: `/replays/comments/?page=${value}` })
          }
          page={page}
          showFirstButton
          showLastButton
        />
      </Pag>
    </Root>
  );
};

const Root = styled.div`
  background: ${p => p.theme.paperBackground};
`;

const Br = styled.div`
  width: 100%;
  height: 3px;
`;

const Pag = styled.div`
  display: flex;
  justify-content: center;
  padding: 25px 0;
`;

export default ReplayCommentArchive;
