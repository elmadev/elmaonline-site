import React from 'react';

import Time from 'components/Time';

export default {
  title: 'Data/Time',
  component: Time,
};

const Template = args => <Time {...args} />;

export const ElmaTime = Template.bind({});
ElmaTime.args = {
  time: 11399,
};

export const Apples = Template.bind({});
Apples.args = {
  time: 0,
  apples: 4,
};

export const Thousands = Template.bind({});
Thousands.args = {
  time: 11399,
  thousands: true,
};
