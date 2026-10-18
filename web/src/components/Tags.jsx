import React from 'react';
import styled from '@emotion/styled';
import Tag from 'components/Tag';

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  & > * {
    margin: 2px;
  }
`;

const Tags = ({ tags }) => (
  <TagsContainer>
    {tags
      .sort((a, b) => a.localeCompare(b))
      .map((tag, index) => {
        return <Tag tag={tag} key={index} />;
      })}
  </TagsContainer>
);

export default Tags;
