import React from 'react';
import styled from '@emotion/styled';
import config from 'config';

const Avatar = ({ collapse = false, kuski, margin = 20 }) => {
  return (
    <Picture collapse={collapse} margin={margin}>
      {kuski.BmpCRC ? (
        <img src={`${config.dlUrl}shirt/${kuski.KuskiIndex}`} alt="shirt" />
      ) : null}
    </Picture>
  );
};

const Picture = styled.div`
  height: ${p => (p.collapse ? '50px' : '150px')};
  width: ${p => (p.collapse ? '50px' : '150px')};
  flex: 0 0 ${p => (p.collapse ? '50px' : '150px')};
  border-radius: 50%;
  margin: ${p => p.margin}px;
  background-color: transparent;
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent ${p => (p.collapse ? '7px' : '20px')},
    #f1f1f1 0,
    #f1f1f1 ${p => (p.collapse ? '17px' : '50px')}
  );
  img {
    margin: auto;
    display: block;
    padding: 10px;
    width: 104px;
    ${p => p.collapse && 'padding: 0; width: 36px; padding-top: 2px;'}
    transition-property: width, padding;
    transition-duration: 1s;
  }
  @media (max-width: 940px) {
    margin: ${p => p.margin}px auto;
  }
  transition-duration: 1s;
  transition-property: height, width, flex;
`;

export default Avatar;
