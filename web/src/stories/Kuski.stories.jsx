import React from 'react';

import Kuski from 'components/Kuski';

export default {
  title: 'Data/Kuski',
  component: Kuski,
};

const Template = args => <Kuski {...args} />;

export const Normal = Template.bind({});
Normal.args = {
  kuskiData: { Kuski: 'Kopaka' },
};

export const WithTeam = Template.bind({});
WithTeam.args = {
  kuskiData: { Kuski: 'Kopaka', TeamData: { Team: 'EMA' } },
  team: true,
};

export const WithFlag = Template.bind({});
WithFlag.args = {
  kuskiData: { Kuski: 'Kopaka', Country: 'DK', TeamData: { Team: 'EMA' } },
  team: true,
  flag: true,
};
