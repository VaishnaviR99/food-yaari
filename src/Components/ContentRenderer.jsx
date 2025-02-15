import React from 'react';
import { Editor, EditorState, convertFromRaw } from 'draft-js';

const ContentRenderer = ({ rawContent }) => {
  const contentState = convertFromRaw(rawContent);
  const editorState = EditorState.createWithContent(contentState);

  return (
    <div className="content-renderer">
      <Editor
        editorState={editorState}
        readOnly={true}
      />
    </div>
  );
};

export default ContentRenderer;