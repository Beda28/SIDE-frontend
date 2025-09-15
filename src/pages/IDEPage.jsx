import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import FileTree from "../components/FileTree";
import Editor from "../components/Editor";
import Terminal from "../components/Terminal";
import axios from "axios";

export default function IDEPage() {
  const { id } = useParams(); // id는 "owner_repo" 형태
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [loading, setLoading] = useState(true);

  // 평면 구조 → 트리 구조 변환 함수
  function buildFileTree(files) {
    const root = [];

    files.forEach((file) => {
      const parts = file.name.split("/");
      let current = root;

      parts.forEach((part, idx) => {
        let node = current.find((f) => f.name === part);

        if (!node) {
          node = {
            type: idx === parts.length - 1 ? "file" : "folder",
            name: part,
            ...(idx === parts.length - 1 ? { content: file.content } : { children: [] }),
          };
          current.push(node);
        }

        if (node.type === "folder") {
          current = node.children;
        }
      });
    });

    return root;
  }

  useEffect(() => {
    const initAndFetchFiles = async () => {
      try {
        await axios.post(`http://localhost:4184/api/ide/init/${id}/python`);

        const res = await axios.get(
          `http://localhost:4184/api/ide/getfile?fullname=${id}`
        );
        const fetchedFiles = res.data;

        // 파일 트리 구조로 변환
        const tree = buildFileTree(fetchedFiles);

        setFiles(tree);

        // 첫 번째 파일 자동 선택
        const firstFile = fetchedFiles.find((f) => !f.name.includes("/"));
        if (firstFile) {
          setActiveFile(firstFile);
          setFileContent(firstFile.content);
        }
      } catch (err) {
        console.error("IDE 초기화 실패:", err);
        alert("IDE 초기화 실패. 콘솔 확인.");
      } finally {
        setLoading(false);
      }
    };

    initAndFetchFiles();
  }, [id]);

  if (loading) return <p>IDE 로딩 중...</p>;

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>
      {/* 왼쪽 사이드 패널 */}
      <div
        style={{
          width: "220px",
          background: "#1e1e1e",
          color: "white",
          padding: "10px",
          overflowY: "auto",
        }}
      >
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
