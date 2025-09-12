import React from "react";

export default function FileTree({ files, activeFile, setActiveFile }) {
  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {files.map((file, idx) => (
        <li key={idx}>
          <button
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              background: activeFile.name === file.name ? "#333" : "transparent",
              color: "white",
              border: "none",
              padding: "5px",
              cursor: "pointer"
            }}
            onClick={() => setActiveFile(file)}
          >
            {file.name}
          </button>
        </li>
      ))}
    </ul>
  );
}
