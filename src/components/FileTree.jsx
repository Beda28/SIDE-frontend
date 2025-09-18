import React, { useState } from "react";

const FileTreeNode = ({ node, onFileSelect, level = 0, activeFile }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isDirectory = node.type === "folder";

  const isSelected = activeFile && node.name === activeFile.name;

  const handleClick = () => {
    if (isDirectory) {
      setIsExpanded(!isExpanded);
    } else {
      onFileSelect(node);
    }
  };

  const nodeStyle = {
    cursor: "pointer",
    margin: "3px 0",
    color: isDirectory ? "#ccc" : "#fff",
    backgroundColor: isSelected ? "#333" : "transparent",
    paddingLeft: `${level * 15}px`,
  };

  return (
    <div>
      <p onClick={handleClick} style={nodeStyle}>
        {isDirectory ? (isExpanded ? "▼ " : "▶ ") : ""}
        {isDirectory ? "📁 " : "📄 "}
        {node.name}
      </p>
      {isExpanded && isDirectory && node.children && (
        <div>
          {node.children.map((childNode) => (
            <FileTreeNode
              key={childNode.name}
              node={childNode}
              onFileSelect={onFileSelect}
              level={level + 1}
              activeFile={activeFile}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function FileTree({ files, onFileSelect, activeFile }) {
  if (!files || files.length === 0) {
    return <p>파일이 없습니다.</p>;
  }
  return (
    <div>
      {files.map((file) => (
        <FileTreeNode
          key={file.name}
          node={file}
          onFileSelect={onFileSelect}
          activeFile={activeFile}
        />
      ))}
    </div>
  );
}