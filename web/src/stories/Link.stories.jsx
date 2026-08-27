import React from 'react';

import Link from 'components/Link';

export default {
  title: 'Layout/Link',
  component: Link,
};

const Template = args => <Link {...args} />;

export const Normal = Template.bind({});
Normal.args = {
  to: 'link',
  children: 'children',
};
