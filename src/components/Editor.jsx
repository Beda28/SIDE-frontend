import React from "react";
import Editor from "@monaco-editor/react";

export default function CodeEditor({ file, content, setContent }) {
  return (
    <Editor
      height="100%"
      defaultLanguage="javascript"
      value={content}
      onChange={(value) => setContent(value)}
      theme="vs-dark"
    />
  );
}
