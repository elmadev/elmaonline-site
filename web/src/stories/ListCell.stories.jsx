import React from 'react';

import { ListCell, ListContainer, ListHeader, ListRow } from 'components/List';

export default {
  title: 'Layout/ListCell',
  component: ListCell,
  argTypes: {
    whiteSpace: {
      control: {
        type: 'select',
        options: [
          'normal',
          'nowrap',
          'pre',
          'pre-wrap',
          'pre-line',
          'break-spaces',
        ],
      },
    },
    width: {
      type: 'number',
    },
    right: {
      type: 'boolean',
    },
    highlight: {
      type: 'boolean',
    },
    to: {
      type: 'text',
    },
  },
};

const Template = args => (
  <ListContainer>
    <ListHeader>
      <ListCell>Header</ListCell>
      <ListCell>Header</ListCell>
    </ListHeader>
    <ListRow>
      <ListCell {...args} />
      <ListCell {...args} />
    </ListRow>
  </ListContainer>
);

export const Normal = Template.bind({});
Normal.args = {
  width: 200,
  children: 'children',
};

export const WithLink = Template.bind({});
WithLink.args = {
  width: 200,
  children: 'children',
  to: 'link',
};
