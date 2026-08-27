import React from 'react';

import FieldBoolean from 'components/FieldBoolean';

export default {
  title: 'Input/FieldBoolean',
  component: FieldBoolean,
};

const Template = args => <FieldBoolean {...args} />;

export const Checked = Template.bind({});
Checked.args = {
  value: true,
  label: 'label',
  onChange: null,
};

export const Unchecked = Template.bind({});
Unchecked.args = {
  value: false,
  label: 'label',
  onChange: null,
};
