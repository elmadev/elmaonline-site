import React, { useEffect } from 'react';
import Layout from 'components/Layout';
import styled from '@emotion/styled';
import LevelEditorGui from 'level-editor-gui';

const EditorContainer = styled.div`
  height: calc(100vh - 50px);
`;

const Editor = () => {
  useEffect(() => {
    const editor = new LevelEditorGui({
      element: 'level-editor',
    });

    return () => {
      editor.stopAnimationLoop();
      // library appends its own DOM into the container and has no teardown
      // remove it to avoid duplicates on remount
      editor.wrapper.remove();
    };
  }, []);

  return (
    <Layout edge t="Online Editor">
      <EditorContainer id="level-editor" />
    </Layout>
  );
};

export default Editor;
