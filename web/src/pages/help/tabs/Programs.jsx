import React, { Fragment } from 'react';
import styled from '@emotion/styled';
import Header from 'components/Header';
import { ListCell, ListContainer, ListRow, ListHeader } from 'components/List';
import * as sections from './programs.json';

const Programs = ({ hideHeader = false }) => {
  return (
    <div>
      <Text>
        {hideHeader ? null : (
          <>
            <Header h2>Programs</Header>
            This is a list of community made programs and tools. If anything is
            missing make a pull request to{' '}
            <a href="https://github.com/elmadev/elmaonline-web/blob/dev/src/pages/help/tabs/programs.json">
              this file
            </a>{' '}
            or make a{' '}
            <a href="https://github.com/elmadev/elmaonline-site/issues/479">
              comment here
            </a>
            .
          </>
        )}
        {sections.default.map(section => (
          <Fragment key={section.name}>
            <Header h2 top>
              {section.name}
            </Header>
            <ListContainer>
              <ListHeader>
                <ListCell width={250}>Name/Download</ListCell>
                <ListCell>Description</ListCell>
              </ListHeader>
              {section.items.map(item => (
                <ListRow key={item.n}>
                  {Array.isArray(item.l) ? (
                    <ListCell>
                      {item.n}{' '}
                      {item.l.map(l => (
                        <Fragment key={l.t}>
                          <a href={l.l}>{l.t}</a>{' '}
                        </Fragment>
                      ))}
                    </ListCell>
                  ) : (
                    <ListCell to={item.l} width={250}>
                      {item.n}
                    </ListCell>
                  )}
                  <ListCell>{item.d}</ListCell>
                </ListRow>
              ))}
            </ListContainer>
          </Fragment>
        ))}
      </Text>
    </div>
  );
};

const Text = styled.div`
  padding-left: 8px;
  max-width: 900px;
`;

export default Programs;
