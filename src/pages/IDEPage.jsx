import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import FileTree from "../components/FileTree";
import Editor from "../components/Editor";
import Terminal from "../components/Terminal";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function IDEPage() {
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type") || "python";
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [loading, setLoading] = useState(true);

  function buildFileTree(files) {
    const root = [];
    files.forEach((file) => {
      const parts = file.name.split("\\");
      let current = root;
      parts.forEach((part, idx) => {
        let node = current.find((f) => f.name === part);
        if (!node) {
          node = {
            type: idx === parts.length - 1 ? "file" : "folder",
            name: part,
            path: file.name,
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
        await axios.post(`${API_BASE}/api/ide/init/${id}/${type}`);
        const res = await axios.get(
          `${API_BASE}/api/ide/getfile?fullname=${id}`
        );
        const fetchedFiles = res.data;
        const tree = buildFileTree(fetchedFiles);
        setFiles(tree);

        const firstFile = fetchedFiles.find((f) => !f.name.includes("\\"));
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
      <div
        style={{
          width: "350px",
          background: "#1e1e1e",
          color: "white",
          padding: "10px",
          overflowY: "auto",
        }}
      >
        <div className="sidebar">
          <FileTree
            files={files}
            onFileSelect={(file) => {
              setActiveFile(file);
              setFileContent(file.content);
            }}
            activeFile={activeFile}
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