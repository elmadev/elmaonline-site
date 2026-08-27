import React from 'react';

import GridItem from 'components/GridItem';

export default {
  title: 'Layout/GridItem',
  component: GridItem,
};

const Template = args => <GridItem {...args} />;

export const Normal = Template.bind({});
Normal.args = {
  name: 'Name',
  longname: 'Long name is longer',
  to: 'link',
};

export const Promote = Template.bind({});
Promote.args = {
  name: 'Name',
  longname: 'Long name is longer',
  promote: true,
  to: 'link',
};
