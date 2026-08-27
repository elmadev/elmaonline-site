import React from 'react';

import LocalTime from 'components/LocalTime';

export default {
  title: 'Data/LocalTime',
  component: LocalTime,
};

const Template = args => <LocalTime {...args} />;

export const Normal = Template.bind({});
Normal.args = {
  date: 1617374995,
  format: 'HH:mm:ss',
  parse: 'X',
};
