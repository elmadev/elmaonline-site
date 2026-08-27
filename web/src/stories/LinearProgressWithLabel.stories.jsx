import React from 'react';

import LinearProgressWithLabel from 'components/LinearProgressWithLabel';

export default {
  title: 'Data/LinearProgressWithLabel',
  component: LinearProgressWithLabel,
};

const Template = args => <LinearProgressWithLabel {...args} />;

export const Normal = Template.bind({});
Normal.args = {
  value: 20,
  remainingSeconds: 100,
};
