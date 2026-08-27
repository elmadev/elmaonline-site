import React from 'react';

import Download from 'components/Download';

export default {
  title: 'Layout/Download',
  component: Download,
};

const Template = args => <Download {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  href: 'link',
  children: 'Text',
};
