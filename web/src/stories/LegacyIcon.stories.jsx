import React from 'react';

import LegacyIcon from 'components/LegacyIcon';

export default {
  title: 'Data/LegacyIcon',
  component: LegacyIcon,
};

const Template = args => <LegacyIcon {...args} />;

export const Moposite = Template.bind({});
Moposite.args = {
  source: 1,
  show: true,
};

export const Kopasite = Template.bind({});
Kopasite.args = {
  source: 2,
  show: true,
};

export const Skintatious = Template.bind({});
Skintatious.args = {
  source: 3,
  show: true,
};

export const Zebrasite = Template.bind({});
Zebrasite.args = {
  source: 4,
  show: true,
};

export const ZebrasiteUnverified = Template.bind({});
ZebrasiteUnverified.args = {
  source: 5,
  show: true,
};

export const Stats = Template.bind({});
Stats.args = {
  source: 6,
  show: true,
};
