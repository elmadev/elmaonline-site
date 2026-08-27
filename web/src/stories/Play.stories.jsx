import React from 'react';

import Play from 'components/Play';

export default {
  title: 'Data/Play',
  component: Play,
};

const Template = args => <Play {...args} />;

export const Replay = Template.bind({});
Replay.args = {
  onClick: null,
  type: 'replay',
};

export const Map = Template.bind({});
Map.args = {
  onClick: null,
  type: 'map',
};
