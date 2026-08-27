import React from 'react';

import { ListCell, ListContainer, ListHeader, ListRow } from 'components/List';

export default {
  title: 'Layout/ListRow',
  component: ListRow,
  argTypes: {
    selected: {
      type: 'boolean',
    },
    bg: {
      type: 'text',
    },
    title: {
      type: 'text',
    },
    highlight: {
      type: 'boolean',
    },
  },
};

const Template = args => (
  <ListContainer>
    <ListHeader>
      <ListCell>Header</ListCell>
      <ListCell>Header</ListCell>
    </ListHeader>
    <ListRow {...args}>
      <ListCell>Cell content</ListCell>
      <ListCell>Cell content</ListCell>
    </ListRow>
  </ListContainer>
);

export const Normal = Template.bind({});
Normal.args = {
  title: 'hover text',
  onClick: null,
};

export const Highligted = Template.bind({});
Highligted.args = {
  title: 'hover text',
  highlight: true,
  onClick: null,
};

export const Selected = Template.bind({});
Selected.args = {
  title: 'hover text',
  selected: true,
  onClick: null,
};
