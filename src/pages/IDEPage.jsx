import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { FaFileAlt, FaTools, FaCodeBranch } from "react-icons/fa";
import FileTree from "../components/FileTree";
import ToolsPanel from "../components/ToolsPanel";
import GitPanel from "../components/GitPanel";
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
  const [openFiles, setOpenFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePanel, setActivePanel] = useState("files");

  const [fakeProgress, setFakeProgress] = useState(0);
  const [apiProgress, setApiProgress] = useState(0);
  const progress = Math.max(fakeProgress, apiProgress);

  const [start, setstart] = useState(false);
  const navigate = useNavigate();

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

  const Add = async (parentNode, type) => {
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

  const Delete = (path) => {
    const removeRecursive = (nodes) =>
      nodes
        .filter((n) => n.path !== path)
        .map((n) =>
          n.type === "folder" ? { ...n, children: removeRecursive(n.children) } : n
        );

    setFiles((prev) => removeRecursive(prev));
    setActiveFile(null);
  };

  const Rename = (oldPath, newPath) => {
    setFiles(prev =>
      prev.map(file =>
        file.path === oldPath ? { ...file, path: newPath, name: newPath.split("/").pop() } : file
      )
    );
  };

  const openFile = (file) => {
    // 에디터에 폴더도 열리는데 주석 해제하면 폴더 포커싱이 안돼서 폴더 하위에 새 파일 생성이 안됨
    
    setActiveFile(file);
    setFileContent(file.content);
    
    if (file.type === "folder") return;
    setOpenFiles((prev) => {
      if (!prev.find((f) => f.path === file.path)) {
        return [...prev, { ...file, modified: false }]; 
      }
      return prev;
    });
  };

  const closeFile = (path) => {
    setOpenFiles((prev) => prev.filter((f) => f.path !== path));
    if (activeFile?.path === path) {
      const remaining = openFiles.filter((f) => f.path !== path);
      setActiveFile(remaining.length > 0 ? remaining[remaining.length - 1] : null);
      setFileContent(remaining.length > 0 ? remaining[remaining.length - 1].content : "");
    }
  };

  const Start = async () => {
    const res = await axios.post(`${API_BASE}/api/test/start/${id}`);
    if (res.data.message) {if (!start) setstart(true)}
    // 포트반환. 포트가지고 실행시킨거 띄우거나 하는 로직 추가하기
  }
  
  const Clear = async () => {
    try {
      await axios.get(`${API_BASE}/api/ide/clear/${id}`);
      navigate(-1);
    } catch (e) {
      console.error("IDE 세션 정리 실패:", e);
    }
  }

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
      clearInterval(fakeInterval);
    };
  }, [id, type]);

  useEffect(() => {
    const SaveFile = async (e) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();

        if (!activeFile) return;
        try {
          await axios.post(`${API_BASE}/api/ide/savefile`, {
            fullname: id,
            path: activeFile.path,
            content: fileContent,
          });

          setOpenFiles((prev) =>
            prev.map((f) =>
              f.path === activeFile.path ? { ...f, content: fileContent, modified: false } : f
            )
          );
        } catch (err) {
          console.error("파일 저장 실패:", err);
          alert("파일 저장 실패");
        }
      }
    };

    window.addEventListener("keydown", SaveFile);
    return () => window.removeEventListener("keydown", SaveFile);
  }, [activeFile, fileContent, id]);

  if (loading) return <LoadingScreen progress={progress} />;

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>
      {/* 사이드 패널 버튼 */}
      <div
        style={{
          width: "50px",
          background: "#252526",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "10px",
        }}
      >
        <button
          onClick={() => setActivePanel("files")}
          style={{
            marginBottom: "10px",
            color: activePanel === "files" ? "#fff" : "#888",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "24px",
          }}
          title="Files"
        >
          <FaFileAlt />
        </button>
        <button
          onClick={() => setActivePanel("tools")}
          style={{
            marginBottom: "10px",
            color: activePanel === "tools" ? "#fff" : "#888",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "24px",
          }}
          title="Tools"
        >
          <FaTools />
        </button>
        <button
          onClick={() => setActivePanel("git")}
          style={{
            marginBottom: "10px",
            color: activePanel === "git" ? "#fff" : "#888",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "24px",
          }}
          title="Git"
        >
          <FaCodeBranch />
        </button>
        <button onClick={Start}>시작</button>
        <button onClick={Clear}>삭제</button>
      </div>

      {/* 패널 */}
      <div
        style={{
          width: "300px",
          background: "#1e1e1e",
          color: "white",
          overflowY: "auto",
        }}
      >
        {activePanel === "files" && (
          <FileTree
            files={files}
            onFileSelect={openFile}
            activeFile={activeFile}
            onAdd={Add}
            onDelete={Delete}
            onRename={Rename}
            repoId={id}
          />
        )}
        {activePanel === "tools" && <ToolsPanel />}
        {activePanel === "git" && <GitPanel repoId={id} />}
      </div>

      {/* 에디터 & 터미널 */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* 탭 영역 */}
        <div style={{ display: "flex", background: "#2d2d2d", color: "white" }}>
          {openFiles.map((file) => (
            <div
              key={file.path}
              style={{
                padding: "5px 10px",
                borderRight: "1px solid #444",
                background: activeFile?.path === file.path ? "#1e1e1e" : "transparent",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => openFile(file)}
            >
              {file.name}
              {file.modified && "*"}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeFile(file.path);
                }}
                style={{
                  marginLeft: "8px",
                  background: "none",
                  border: "none",
                  color: "#aaa",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* 에디터 */}
        <div style={{ flex: 1 }}>
          {activeFile ? (
            <Editor
              file={activeFile}
              content={fileContent}
              setContent={(newContent) => {
                setFileContent(newContent);
                setOpenFiles((prev) =>
                  prev.map((f) =>
                    f.path === activeFile.path
                      ? { ...f, content: newContent, modified: true }
                      : f
                  )
                );
              }}
            />
          ) : (
            <div style={{ color: "white", padding: "20px" }}>
              파일을 선택하면 여기에 표시됩니다.
            </div>
          )}
        </div>

        {/* 터미널 */}
        <div style={{ height: "150px" }}>
          <Terminal start={start} />
        </div>
      </div>
    </div>
  );
};

export default IDEPage;