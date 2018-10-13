import React from 'react';
import LevelEditorGui from 'level-editor-gui';

class Editor extends React.Component {
  componentDidMount() {
    this.editor = new LevelEditorGui({
      element: 'level-editor',
      server: 'http://janka.la:3123',
    });
  }
  componentWillUnmount() {
    this.editor.stopAnimationLoop();
  }
  render() {
    return (
      <div
        style={{
          height: '100%',
          marginTop: -50,
          paddingTop: 50,
          boxSizing: 'border-box',
          background: '#000000',
        }}
      >
        <div
          id="level-editor"
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </div>
    );
  }
}

export default Editor;
