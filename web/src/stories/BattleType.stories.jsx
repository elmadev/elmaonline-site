import React from 'react';

import { BattleType } from 'components/Names';

export default {
  title: 'Data/BattleType',
  component: BattleType,
};

const Template = args => <BattleType {...args} />;

export const Normal = Template.bind({});
Normal.args = {
  type: 'NM',
};

export const FirstFinish = Template.bind({});
FirstFinish.args = {
  type: 'FF',
};
