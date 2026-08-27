import React from 'react';
import styled from 'styled-components';

import { Row, Column } from 'components/Containers';
import { padding, alignItems, justifyContent } from './controls';

export default {
  title: 'Layout/Containers',
  component: Column,
  argTypes: {
    t: {
      control: padding,
    },
    b: {
      control: padding,
    },
    l: {
      control: padding,
    },
    r: {
      control: padding,
    },
    center: {
      type: 'boolean',
    },
    ai: {
      control: alignItems,
    },
    jc: {
      control: justifyContent,
    },
  },
};

const Red = styled.div`
  background-color: red;
  height: 100px;
  width: 100px;
`;

const Blue = styled(Red)`
  background-color: blue;
`;

const Green = styled(Red)`
  background-color: Green;
`;

const TemplateColumn = args => (
  <Column {...args}>
    <Red />
    <Blue />
    <Green />
  </Column>
);

export const FlexColumn = TemplateColumn.bind({});

const TemplateRow = args => (
  <Row {...args}>
    <Red />
    <Blue />
    <Green />
  </Row>
);

export const FlexRow = TemplateRow.bind({});
