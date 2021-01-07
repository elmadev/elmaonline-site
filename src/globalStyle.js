import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html {
    color: #222;
    font-weight: 100;
    font-size: 1em;
    font-family: 'Segoe UI', 'HelveticaNeue-Light', sans-serif;
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
  #app {
    height: 100% !important;
    margin: 0;
    padding: 0;
    font-weight: 400;
  }
  body {
    margin: 0;
    margin-top: 50px;
  }
  a {
    color: #219653;
    text-decoration: none;
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
`;

export default GlobalStyle;
