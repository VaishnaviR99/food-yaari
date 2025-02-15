import React, { useState } from 'react';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import '../Styles/TextEditor.css';
import { db } from '../Firebase/firebaseConfig'; 
import { collection, getDocs, query, where,addDoc } from 'firebase/firestore'; 

export const TextEditor = ({ setPostContent, initialContent }) => { // Add initialContent prop
  const [editorState, setEditorState] = useState(() => {
      if (initialContent) {
          try {
              const contentState = convertFromRaw(JSON.parse(initialContent)); // Parse the stringified content
              return EditorState.createWithContent(contentState);
          } catch (error) {
              console.error("Error converting from raw:", error);
              return EditorState.createEmpty();
          }
      }
      return EditorState.createEmpty();
  });
  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  // Style controls
  const toggleInlineStyle = (style) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const toggleBlockType = (blockType) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  const handleEditorChange = (newEditorState) => {
    setEditorState(newEditorState);
    const contentState = newEditorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    setPostContent(JSON.stringify(rawContent)); // Stringify and send to parent on every change
}

  return (
    <div className="editor-container">
      <div className="toolbar">
        {/* Text Formatting */}
        <button type='button' onClick={() => toggleInlineStyle('BOLD')}>B</button>
        <button type='button' onClick={() => toggleInlineStyle('ITALIC')}>I</button>
        <button type='button' onClick={() => toggleInlineStyle('UNDERLINE')}>U</button>
        
        {/* Block Formatting */}
        <button type='button' onClick={() => toggleBlockType('header-one')}>H1</button>
        <button type='button' onClick={() => toggleBlockType('header-two')}>H2</button>
        <button type='button' onClick={() => toggleBlockType('unordered-list-item')}>• List</button>
        
        {/* Text Alignment */}
        <button type='button' onClick={() => toggleBlockType('text-align-left')}>Left</button>
        <button type='button' onClick={() => toggleBlockType('text-align-center')}>Center</button>
        <button type='button' onClick={() => toggleBlockType('text-align-right')}>Right</button>
      </div>

      <div className="editor-wrapper">
      <Editor
                    editorState={editorState}
                    onChange={handleEditorChange}  // Call handleEditorChange on every edit
                    handleKeyCommand={handleKeyCommand}
                    placeholder="Start writing..."
                />
            </div>
            
        </div>

);
};