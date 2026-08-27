import React, { useEffect, useState } from 'react';
import LocalTime from 'components/LocalTime';
import styled from '@emotion/styled';
import { CardContent } from '@material-ui/core';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { ListRow, ListCell, ListContainer } from 'components/List';
import { Parser } from 'react-tiny-bbcode';
import Header from 'components/Header';
import { Card, Cross } from 'pages/home';

const News = ({ amount, height = 0, onCross = null }) => {
  const [open, setOpen] = useState(0);
  const { news } = useStoreState(state => state.News);
  const { getNews } = useStoreActions(actions => actions.News);
  useEffect(() => {
    getNews(amount);
  }, []);

  const openNews = index => {
    if (index === open) {
      setOpen(0);
    } else {
      setOpen(index);
    }
  };

  return (
    <Card>
      {onCross ? (
        <span title="Hide section">
          <Cross onClick={() => onCross()} />
        </span>
      ) : null}
      <CardContent>
        <Header h2>News</Header>
        <Scroll height={height}>
          <ListContainer>
            {news.map(n => (
              <ListRow key={n.NewsIndex} onClick={() => openNews(n.NewsIndex)}>
                <ListCell>
                  <Headline selected={open === n.NewsIndex}>
                    {n.Headline}{' '}
                    <Written>
                      <LocalTime
                        date={n.Written}
                        format="eee d MMM yyyy"
                        parse="X"
                      />
                    </Written>
                  </Headline>
                  {open === n.NewsIndex && (
                    <div>
                      <Parser bbcode={n.News} />
                    </div>
                  )}
                </ListCell>
              </ListRow>
            ))}
          </ListContainer>
        </Scroll>
      </CardContent>
    </Card>
  );
};

const Scroll = styled.div`
  ${p => (p.height ? `max-height: ${p.height}px;` : '')}
  overflow-y: auto;
`;

const Headline = styled.div`
  font-weight: ${p => (p.selected ? 'bold' : 'normal')};
`;

const Written = styled.span`
  color: ${p => p.theme.lightTextColor};
`;

export default News;
