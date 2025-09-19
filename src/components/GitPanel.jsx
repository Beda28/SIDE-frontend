import React from "react";

const GitPanel = () => {
  return (
    <div style={{ padding: "10px" }}>
      <h3>Git</h3>
      <button style={{ display: "block", marginBottom: "5px" }}>Status</button>
      <button style={{ display: "block", marginBottom: "5px" }}>Commit</button>
      <button style={{ display: "block", marginBottom: "5px" }}>Push</button>
    </div>
  );
};

export default GitPanel;