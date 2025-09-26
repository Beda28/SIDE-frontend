import React from "react";
import FileTreeNode from "./FileTreeNode";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const FileTree = ({ files, onFileSelect, activeFile, onAdd, onDelete, onRename, repoId }) => {
  const navigate = useNavigate()

  const Delete = async () => {
    if (!activeFile) return alert("삭제할 파일/폴더를 선택하세요.");
    const confirmDelete = window.confirm(`정말 "${activeFile.name}"을(를) 삭제하시겠습니까?`);
    if (!confirmDelete) return;

    try {
      await axios.post(`${API_BASE}/api/ide/deletefile`, {
        fullname: repoId,
        path: activeFile.path,
      });

      onDelete(activeFile.path);
      alert(`"${activeFile.name}" 삭제 성공`);
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제 실패");
    }
  };

  const Rename = async () => {
    if (!activeFile) return alert("이름을 변경할 파일/폴더를 선택하세요.");
    const newName = prompt(`"${activeFile.name}"의 새 이름을 입력하세요:`, activeFile.name);
    if (!newName || newName === activeFile.name) return;

    try {
      const oldPath = activeFile.path;
      const pathParts = oldPath.split("/");
      pathParts[pathParts.length - 1] = newName;
      const newPath = pathParts.join("/");

      await axios.post(`${API_BASE}/api/ide/renamefile`, {
        fullname: repoId,
        old_path: oldPath,
        new_path: newPath,
      });

      onRename(oldPath, newPath);
      alert(`"${activeFile.name}" → "${newName}" 이름 변경 성공`);

      navigate(`/ide/${repoId}`)
    } catch (err) {
      console.error("이름 변경 실패:", err);
      alert("이름 변경 실패");
    }
  };

  return (
    <div>
      <div style={{ padding: "10px" }}>
        <h3>FileTree</h3>
        <button onClick={() => onAdd(activeFile ? activeFile : null, "file")}>+ New File</button>
        <button onClick={() => onAdd(activeFile ? activeFile : null, "folder")}>+ New Folder</button>
        <button onClick={Delete} disabled={!activeFile}>Delete</button>
        <button onClick={Rename} disabled={!activeFile}>Rename</button>
      </div>

      {files.map((file) => (
        <FileTreeNode
          key={file.path}
          node={file}
          onFileSelect={onFileSelect}
          activeFile={activeFile}
        />
      ))}
    </div>
  );
};

export default FileTree;