import React from "react";

export default function SelectTypeModal({ onClose, onSelect }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ background: "white", padding: "20px", borderRadius: "10px" }}>
        <h2>언어 선택</h2>
        <div style={{ marginTop: "15px" }}>
          <button
            onClick={() => {
              onSelect("node");
              onClose();
            }}
            style={{ marginRight: "10px" }}
          >
            Node
          </button>
          <button
            onClick={() => {
              onSelect("python");
              onClose();
            }}
          >
            Python
          </button>
        </div>
        <div style={{ marginTop: "10px" }}>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
}
