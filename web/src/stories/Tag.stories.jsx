import React from 'react';

import Tag from 'components/Tag';

export default {
  title: 'Data/Tag',
  component: Tag,
};

const Template = args => <Tag {...args} />;

export const Tas = Template.bind({});
Tas.args = {
  tag: 'TAS',
};

export const Bug = Template.bind({});
Bug.args = {
  tag: 'Bug',
};
