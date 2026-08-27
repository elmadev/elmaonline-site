import { Global, css, useTheme } from '@emotion/react';

const GlobalStyle = () => {
  const theme = useTheme();
  return (
    <Global
      styles={css`
        html {
          color: ${theme.fontColor};
          font-weight: 100;
          font-size: ${theme.fontSize};
          font-family: ${theme.fontFamily};
          line-height: 1.375;
        }
        ::-moz-selection {
          background: #b3d4fc;
          text-shadow: none;
        }
        ::selection {
          background: #b3d4fc;
          text-shadow: none;
        }
        hr {
          display: block;
          height: 1px;
          border: 0;
          border-top: 1px solid #ccc;
          margin: 1em 0;
          padding: 0;
        }
        audio,
        canvas,
        iframe,
        img,
        svg,
        video {
          vertical-align: middle;
        }
        fieldset {
          border: 0;
          margin: 0;
          padding: 0;
        }
        textarea {
          resize: vertical;
        }
        :global(.browserupgrade) {
          margin: 0.2em 0;
          background: #ccc;
          color: #000;
          padding: 0.2em 0;
        }
        html,
        body,
        #root,
        #app {
          height: 100% !important;
          margin: 0;
          padding: 0;
          font-weight: 400;
          background: ${theme.pageBackground};
        }
        body {
          margin: 0;
          margin-top: 54px;
        }
        a {
          color: ${theme.linkColor};
          text-decoration: none;
          :hover {
            color: ${theme.linkHover};
          }
        }
        h2,
        h3 {
          margin: 10px;
          font-size: 20px;
          font-weight: normal;
          color: #8c8c8c;
          letter-spacing: 1px;
        }
        h2 {
          text-transform: uppercase;
        }
        *:focus {
          outline: 0;
        }
      `}
    />
  );
};

export default GlobalStyle;
