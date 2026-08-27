import React from 'react';
import Layout from 'components/Layout';
import styled from '@emotion/styled';
import LevelEditorGui from 'level-editor-gui';

const EditorContainer = styled.div`
  height: calc(100vh - 50px);
`;

class Editor extends React.Component {
  componentDidMount() {
    this.editor = new LevelEditorGui({
      element: 'level-editor',
      server: 'https://editor.elma.online',
    });
  }

  componentWillUnmount() {
    this.editor.stopAnimationLoop();
  }

  render() {
    return (
      <Layout edge t="Online Editor">
        <EditorContainer id="level-editor" />
      </Layout>
    );
  }
}

export default Editor;
