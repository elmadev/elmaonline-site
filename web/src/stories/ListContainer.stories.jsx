import React from 'react';

import { ListCell, ListContainer, ListHeader, ListRow } from 'components/List';

export default {
  title: 'Layout/ListContainer',
  component: ListContainer,
  argTypes: {
    chin: {
      type: 'boolean',
    },
    width: {
      type: 'text',
    },
    horizontalMargin: {
      type: 'text',
    },
  },
};

const Template = args => (
  <ListContainer {...args}>
    <ListHeader>
      <ListCell>Header</ListCell>
      <ListCell>Header</ListCell>
    </ListHeader>
    <ListRow>
      <ListCell>Cell content</ListCell>
      <ListCell>Cell content</ListCell>
    </ListRow>
  </ListContainer>
);

export const Normal = Template.bind({});
