import React from 'react';
import styled from '@emotion/styled';
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined';

export default function PreviewButton({ pack, onPreview }) {
  return (
    <Button
      className="pack-preview"
      type="button"
      title={`Preview ${pack.LevelPackName}`}
      aria-label={`Preview ${pack.LevelPackName}`}
      aria-haspopup="dialog"
      onClick={() => onPreview(pack.LevelPackName)}
    >
      <ImageOutlinedIcon />
    </Button>
  );
}

const Button = styled.button`
  display: inline-flex;
  vertical-align: middle;
  padding: 2px;
  margin-left: 5px;
  border: 0;
  background: transparent;
  color: ${p => p.theme.linkColor};
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  svg {
    width: 20px;
    height: 20px;
  }
  &:focus-visible {
    opacity: 1;
    pointer-events: auto;
  }
  @media (hover: none), (pointer: coarse) {
    opacity: 1;
    pointer-events: auto;
    padding: 8px;
    margin-top: -6px;
    margin-bottom: -6px;
  }
`;
