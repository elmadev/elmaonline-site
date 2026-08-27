import React from 'react';

import { Paper, Content } from 'components/Paper';

export default {
  title: 'Layout/Paper',
  component: Paper,
  argTypes: {
    row: {
      type: 'boolean',
    },
    width: {
      type: 'text',
    },
    padding: {
      type: 'boolean',
    },
    highlight: {
      type: 'boolean',
    },
    center: {
      type: 'boolean',
    },
    grow: {
      type: 'number',
    },
    top: {
      type: 'boolean',
    },
  },
};

const Template = args => <Paper {...args}>Content</Paper>;

export const Normal = Template.bind({});
Normal.args = {
  padding: true,
};

export const NoPadding = Template.bind({});
NoPadding.args = {
  padding: false,
};

const TemplateContent = args => (
  <Paper {...args}>
    Content with no padding<Content>Content with padding</Content>More content
    without padding
  </Paper>
);

export const MixedPadding = TemplateContent.bind({});
MixedPadding.args = {
  padding: false,
};

export const Highlight = Template.bind({});
Highlight.args = {
  padding: true,
  highlight: true,
};
