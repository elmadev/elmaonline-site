import styled from '@emotion/styled';
import { css } from '@emotion/react';

const Popularity = ({ before, after, ...props }) => {
  const pct = Number(props.widthPct || 0).toFixed(2);

  // .pop-wrapper good for adding custom hover effect (so keep
  // it the same size as Root)
  return (
    <Root {...props}>
      <div className="pop-wrapper">
        {before && <Before className="pop-before">{before}</Before>}
        <BarWrapper className="pop-bar-1">
          <Bar className="pop-bar-2" style={{ width: `${pct}%` }} />
        </BarWrapper>
        {after && <After className="pop-after">{after}</After>}
      </div>
    </Root>
  );
};

const BarWrapper = styled.div``;

const Bar = styled.div``;

const Before = styled.div``;

const After = styled.div``;

const Root = styled.div`
  .pop-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    ${p =>
      p.bordered &&
      css`
        &::after {
          content: '';
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: ${p => p.theme.linkColor};
          opacity: 0.1;
        }
      `}
    &:hover {
      ${BarWrapper} {
        background: ${p => p.pageBackgroundDark};
      }
    }
    ${Before} {
      margin-top: -2px;
      margin-right: 8px;
    }
    ${After} {
      margin-top: -2px;
      margin-left: 8px;
    }
    ${BarWrapper} {
      flex: 1 0 auto;
      height: ${p => p.height || 6}px;
      ${Bar} {
        height: ${p => p.height || 6}px;
        background: ${p => p.theme.linkColor};
      }
    }
  }
`;

export default Popularity;
