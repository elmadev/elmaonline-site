import React from 'react';

import Flag from 'components/Flag';

export default {
  title: 'Data/Flag',
  component: Flag,
};

const Template = args => <Flag {...args} />;

export const Denmark = Template.bind({});
Denmark.args = {
  nationality: 'DK',
};

export const Germany = Template.bind({});
Germany.args = {
  nationality: 'DE',
};
