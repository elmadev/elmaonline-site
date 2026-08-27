import React from 'react';

import Header from 'components/Header';

export default {
  title: 'Layout/Header',
  component: Header,
};

const Template = args => <Header {...args} />;

export const H1 = Template.bind({});
H1.args = {
  h1: true,
  children: 'Header',
  onClick: null,
};

export const H2 = Template.bind({});
H2.args = {
  h2: true,
  children: 'Header',
  onClick: null,
};

export const H3 = Template.bind({});
H3.args = {
  h3: true,
  children: 'Header',
  onClick: null,
};
