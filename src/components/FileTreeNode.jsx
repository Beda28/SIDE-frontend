import React, { useState } from "react";

const FileTreeNode = ({ node, onFileSelect, level = 0, activeFile, onAdd }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isDirectory = node.type === "folder";

  const isSelected = activeFile && node.path === activeFile.path;

  const Click = () => {
    if (isDirectory) {
        setIsExpanded(!isExpanded);
        onFileSelect(node);
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
      <p onClick={Click} style={nodeStyle}>
        {isDirectory ? (isExpanded ? "▼ " : "▶ ") : ""}
        {isDirectory ? "📁 " : "📄 "}
        {node.name}
      </p>
      {isExpanded && isDirectory && node.children && (
        <div>
          {node.children.map((childNode) => (
            <FileTreeNode
              key={childNode.path}
              node={childNode}
              onFileSelect={onFileSelect}
              level={level + 1}
              activeFile={activeFile}
              onAdd={onAdd}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FileTreeNode;