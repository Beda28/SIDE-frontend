import React from "react";
import Editor from "@monaco-editor/react";

const getLanguageFromExtension = (filename = "") => {
  const ext = filename.split(".").pop().toLowerCase();

  switch (ext) {
    case "js":
    case "jsx":
      return "javascript";
    case "ts":
    case "tsx":
      return "typescript";
    case "py":
      return "python";
    case "java":
      return "java";
    case "c":
      return "c";
    case "cpp":
    case "cc":
    case "cxx":
      return "cpp";
    case "json":
      return "json";
    case "html":
      return "html";
    case "css":
      return "css";
    case "md":
      return "markdown";
    case "sh":
      return "shell";
    case "xml":
      return "xml";
    case "yaml":
    case "yml":
      return "yaml";
    default:
      return "plaintext";
  }
}

const CodeEditor = ({ file, content, setContent }) => {
  const language = file ? getLanguageFromExtension(file.name) : "plaintext";

  return (
    <Editor
      height="100%"
      language={language}
      value={content}
      onChange={(value) => setContent(value)}
      theme="vs-dark"
    />
  );
}

export default CodeEditor;