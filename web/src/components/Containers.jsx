import React from 'react';
import styled from '@emotion/styled';

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  ${p => p.center && `justify-content: center; align-items: center;`}
  ${p => p.width && `width: ${p.width};`}  
  ${p => p.height && `width: ${p.height};`}  
  ${p => p.ai && `align-items: ${p.ai};`}
  ${p => p.jc && `justify-content: ${p.jc};`}
  ${p => p.t && `margin-top ${p.theme[`pad${p.t}`]};`}
  ${p => p.b && `margin-bottom ${p.theme[`pad${p.b}`]};`}
  ${p => p.l && `margin-left ${p.theme[`pad${p.l}`]};`}
  ${p => p.r && `margin-right ${p.theme[`pad${p.r}`]};`}
  ${p => p.p && `padding: ${p.theme[`pad${p.p}`]};`}
  ${p => p.m && `margin: ${p.theme[`pad${p.m}`]};`}
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  ${p => p.center && `justify-content: center; align-items: center;`}
  ${p => p.width && `width: ${p.width};`}  
  ${p => p.height && `width: ${p.height};`}  
  ${p => p.ai && `align-items: ${p.ai};`}
  ${p => p.jc && `justify-content: ${p.jc};`}
  ${p => p.t && `margin-top ${p.theme[`pad${p.t}`]};`}
  ${p => p.b && `margin-bottom ${p.theme[`pad${p.b}`]};`}
  ${p => p.l && `margin-left ${p.theme[`pad${p.l}`]};`}
  ${p => p.r && `margin-right ${p.theme[`pad${p.r}`]};`}
  ${p => p.p && `padding: ${p.theme[`pad${p.p}`]};`}
  ${p => p.m && `margin: ${p.theme[`pad${p.m}`]};`}
`;

export const Text = styled.div`
  padding-bottom: ${p => (p.noPad ? 0 : '16px')};
  color: ${p => (p.light ? p.theme.lightTextColor : p.theme.fontColor)};
  font-size: ${p => (p.small ? p.theme.smallFont : p.theme.fontSize)};
  ${p => p.t && `margin-top: ${p.theme[`pad${p.t}`]};`}
  ${p => p.b && `margin-bottom: ${p.theme[`pad${p.b}`]};`}
  ${p => p.l && `margin-left: ${p.theme[`pad${p.l}`]};`}
  ${p => p.r && `margin-right: ${p.theme[`pad${p.r}`]};`}
`;
