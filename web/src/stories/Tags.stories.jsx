import React from 'react';

import Tags from 'components/Tags';

export default {
  title: 'Data/Tags',
  component: Tags,
};

const Template = args => <Tags {...args} />;

export const Normal = Template.bind({});
Normal.args = {
  tags: ['DNF', 'Bug'],
};
