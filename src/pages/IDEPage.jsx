import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import FileTree from "../components/FileTree";
import Editor from "../components/Editor";
import Terminal from "../components/Terminal";
import LoadingScreen from "../components/LoadingScreen";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const IDEPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type") || "python";

  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [loading, setLoading] = useState(true);

  const [fakeProgress, setFakeProgress] = useState(0);
  const [apiProgress, setApiProgress] = useState(0);
  const progress = Math.max(fakeProgress, apiProgress);

  const buildFileTree = (files) => {
    const root = [];
    files.forEach((file) => {
      const parts = file.name.split("\\");
      let current = root;

      parts.forEach((part, idx) => {
        let node = current.find((f) => f.name === part);
        const isFile = idx === parts.length - 1 && file.content !== null;

        if (!node) {
          node = {
            type: isFile ? "file" : "folder",
            name: part,
            path: parts.slice(0, idx + 1).join("\\"),
            ...(isFile ? { content: file.content } : { children: [] }),
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

  const handleAdd = async (parentNode, type) => {
    const name = prompt(`새 ${type} 이름을 입력하세요:`);
    if (!name) return;

    let parentPath = "";
    if (parentNode) {
      if (parentNode.type === "file") {
        const parts = parentNode.path.split("\\");
        parts.pop();
        parentPath = parts.join("\\");
      } else if (parentNode.type === "folder") {
        parentPath = parentNode.path;
      }
    }

    const newPath = parentPath ? `${parentPath}\\${name}` : name;

    try {
      await axios.post(`${API_BASE}/api/ide/addfile`, {
        fullname: id,
        path: newPath,
        type, 
      });

      setFiles((prev) => {
        const addRecursive = (nodes) =>
          nodes.map((n) => {
            if (n.type === "folder" && n.path === parentPath) {
              const newNode =
                type === "file"
                  ? { type: "file", name, path: newPath, content: "" }
                  : { type: "folder", name, path: newPath, children: [] };
              return { ...n, children: [...n.children, newNode] };
            } else if (n.type === "folder") {
              return { ...n, children: addRecursive(n.children) };
            }
            return n;
          });

        if (!parentPath) {
          const newNode =
            type === "file"
              ? { type: "file", name, path: newPath, content: "" }
              : { type: "folder", name, path: newPath, children: [] };
          return [...prev, newNode];
        }
        return addRecursive(prev);
      });
    } catch (err) {
      console.error("파일/폴더 추가 실패:", err);
      alert("파일/폴더 추가 실패");
    }
  };

  const handleDelete = (path) => {
    const removeRecursive = (nodes) =>
      nodes
        .filter((n) => n.path !== path)
        .map((n) =>
          n.type === "folder" ? { ...n, children: removeRecursive(n.children) } : n
        );

    setFiles((prev) => removeRecursive(prev));
    setActiveFile(null);
  };

  useEffect(() => {
    const fakeInterval = setInterval(() => {
      setFakeProgress((prev) => (prev < 90 ? prev + 1 : prev));
    }, 50);

    const initAndFetchFiles = async () => {
      try {
        await axios.post(`${API_BASE}/api/ide/init/${id}/${type}`);

        const res = await axios.get(
          `${API_BASE}/api/ide/getfile?fullname=${id}`,
          {
            onDownloadProgress: (event) => {
              if (event.total) {
                const percent = Math.floor(
                  (event.loaded / event.total) * 100
                );
                setApiProgress(percent);
              }
            },
          }
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
        clearInterval(fakeInterval);
        setApiProgress(100);
        setFakeProgress(100);
        setTimeout(() => setLoading(false), 500);
      }
    };

    initAndFetchFiles();

    return () => {
      const clear = async () => {
        try {
          await axios.get(`${API_BASE}/api/ide/clear/${id}`);
        } catch (e) {
          console.error("IDE 세션 정리 실패:", e);
        }
      };

      clear();
      clearInterval(fakeInterval);
    };
  }, [id, type]);

  if (loading) return <LoadingScreen progress={progress} />;

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
            onAdd={handleAdd}
            onDelete={handleDelete}
            repoId={id}
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

export default IDEPage;