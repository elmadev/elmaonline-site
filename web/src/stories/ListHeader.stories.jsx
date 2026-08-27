import React from 'react';

import { ListCell, ListContainer, ListHeader, ListRow } from 'components/List';

export default {
  title: 'Layout/ListHeader',
  component: ListHeader,
};

const Template = args => (
  <ListContainer>
    <ListHeader>
      <ListCell {...args} />
      <ListCell {...args} />
    </ListHeader>
    <ListRow>
      <ListCell>Cell content</ListCell>
      <ListCell>Cell content</ListCell>
    </ListRow>
  </ListContainer>
);

export const Normal = Template.bind({});
Normal.args = {
  children: 'header name',
};
