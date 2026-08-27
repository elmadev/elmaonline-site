import React from 'react';

import Stars from 'components/Stars';

export default {
  title: 'Data/Stars',
  component: Stars,
};

const Template = args => <Stars {...args} />;

export const Empty = Template.bind({});
Empty.args = {
  voted: 0,
  average: 0,
};

export const Five = Template.bind({});
Five.args = {
  voted: 5,
  average: 5,
};

export const Full = Template.bind({});
Full.args = {
  voted: 10,
  average: 10,
};
