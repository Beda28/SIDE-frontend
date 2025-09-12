import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import FileTree from "../components/FileTree";
import Editor from "../components/Editor";
import Terminal from "../components/Terminal";

export default function IDEPage() {
  const { id } = useParams();

  // 파일 목록 (테스트용)
  const [files, setFiles] = useState([
    { name: "main.py", content: "print('Hello World')" },
    { name: "index.html", content: "<h1>Hello</h1>" },
    { name: "style.css", content: "body { background: #fafafa; }" }
  ]);

  // 현재 활성 파일
  const [activeFile, setActiveFile] = useState(files[0]);
  const [fileContent, setFileContent] = useState(files[0].content);

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>
      {/* 왼쪽 사이드 패널 */}
      <div
        style={{
          width: "220px",
          background: "#1e1e1e",
          color: "white",
          padding: "10px"
        }}
      >
        {/* 파일 트리 */}
        <div className="sidebar">
          <FileTree
            files={files}
            activeFile={activeFile}
            setActiveFile={(file) => {
              setActiveFile(file);
              setFileContent(file.content);
            }}
          />
        </div>

        <hr style={{ margin: "10px 0", border: "1px solid #444" }} />
        <h3>Tools</h3>
        <button style={{ display: "block", marginBottom: "5px" }}>Base64</button>
        <button style={{ display: "block", marginBottom: "5px" }}>Hash</button>
        <button style={{ display: "block", marginBottom: "5px" }}>Search</button>
        <br />
        <Link to="/repositories">
          <button style={{ marginTop: "10px" }}>Back</button>
        </Link>
      </div>

      {/* 에디터 + 터미널 */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1 }}>
          <Editor
            file={activeFile}
            content={fileContent}
            setContent={(newContent) => {
              setFileContent(newContent);
              setFiles((prevFiles) =>
                prevFiles.map((f) =>
                  f.name === activeFile.name ? { ...f, content: newContent } : f
                )
              );
            }}
          />
        </div>
        <div style={{ height: "150px" }}>
          <Terminal />
        </div>
      </div>
    </div>
  );
}
