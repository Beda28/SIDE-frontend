import React from "react";
import FileTreeNode from "./FileTreeNode";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function FileTree({ files, onFileSelect, activeFile, onAdd, onDelete, repoId }) {
  const handleDelete = async () => {
    if (!activeFile) return alert("삭제할 파일/폴더를 선택하세요.");
    const confirmDelete = window.confirm(`정말 "${activeFile.name}"을(를) 삭제하시겠습니까?`);
    if (!confirmDelete) return;

    try {
      console.log(repoId, activeFile.path)
      await axios.post(`${API_BASE}/api/ide/delete`, {
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

  if (!files || files.length === 0) {
    return (
      <div>
        <p>파일이 없습니다.</p>
        <button onClick={() => onAdd(null, "file")}>+ Root File</button>
        <button onClick={() => onAdd(null, "folder")}>+ Root Folder</button>
        <button onClick={handleDelete} disabled={!activeFile}>Delete</button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => onAdd(activeFile ? activeFile : null, "file")}>+ New File</button>
        <button onClick={() => onAdd(activeFile ? activeFile : null, "folder")}>+ New Folder</button>
        <button onClick={handleDelete} disabled={!activeFile}>Delete</button>
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
}