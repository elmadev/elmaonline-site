import React from 'react';

import { Level } from 'components/Names';

export default {
  title: 'Data/Level',
  component: Level,
};

const Template = args => <Level {...args} />;

export const Internal = Template.bind({});
Internal.args = {
  LevelIndex: 2,
  LevelData: { LevelName: 'QWQUU001' },
};

export const External = Template.bind({});
External.args = {
  LevelIndex: 1,
  LevelData: { LevelName: 'TKT01' },
};

export const LongName = Template.bind({});
LongName.args = {
  LevelIndex: 2,
  LevelData: { LevelName: 'QWQUU001', LongName: 'Warm Up' },
  long: true,
};
