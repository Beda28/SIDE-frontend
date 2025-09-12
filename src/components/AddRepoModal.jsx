import React from "react";

export default function AddRepoModal({ onClose }) {
  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex", justifyContent: "center", alignItems: "center"
    }}>
      <div style={{ background: "white", padding: "20px", borderRadius: "8px", minWidth: "300px" }}>
        <h2>Add Repository</h2>
        <input type="text" placeholder="Repository Name" style={{ width: "100%", marginBottom: "10px" }} />
        <br />
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
