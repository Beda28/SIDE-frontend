import React from "react";

const ToolsPanel = () => {
  return (
    <div style={{ padding: "10px" }}>
      <h3>Tools</h3>
      <button style={{ display: "block", marginBottom: "5px" }}>Base64</button>
      <button style={{ display: "block", marginBottom: "5px" }}>Hash</button>
      <button style={{ display: "block", marginBottom: "5px" }}>Search</button>
    </div>
  );
};

export default ToolsPanel;