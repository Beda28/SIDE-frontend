import React, { useState } from "react";

// SHA-256 해시 함수
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// UUID v4 생성
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (crypto.getRandomValues(new Uint8Array(1))[0] & 15) >> 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const ToolsPanel = () => {
  const [tool, setTool] = useState(null);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  // HEX → RGB 변환
  const hexToRgb = (hex) => {
    let c = hex.replace("#", "");
    if (c.length === 3) c = c.split("").map(ch => ch + ch).join("");
    const num = parseInt(c, 16);
    return `rgb(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255})`;
  };

  const runTool = async () => {
    try {
      switch (tool) {
        case "Base64":
          setOutput(btoa(input));
          break;
        case "Base64Decode":
          setOutput(atob(input));
          break;
        case "Hash":
          setOutput(await sha256(input));
          break;
        case "JSON":
          setOutput(JSON.stringify(JSON.parse(input), null, 2));
          break;
        // case "Regex":
        //   {
        //     const lines = input.split("\n");
        //     const pattern = lines[0];
        //     const flags = lines[1] || "";
        //     const testStr = lines.slice(2).join("\n");
        //     const regex = new RegExp(pattern, flags);
        //     const matches = [...testStr.matchAll(regex)];
        //     if (matches.length === 0) {
        //       setOutput("No matches");
        //     } else {
        //       // 하이라이트 HTML 생성
        //       let result = testStr;
        //       matches.reverse().forEach(m => {
        //         result =
        //           result.slice(0, m.index) +
        //           `%c${m[0]}%c` +
        //           result.slice(m.index + m[0].length);
        //       });
        //       setOutput(result);
        //     }
        //   }
        //   break;
        case "UUID":
          setOutput(generateUUID());
          break;
        case "Color":
          setOutput(`HEX: ${input}\nRGB: ${hexToRgb(input)}`);
          break;
        default:
          setOutput("Tool not implemented");
      }
    } catch (err) {
      setOutput("❌ Error: " + err.message);
    }
  };

  const tools = [
    { name: "Base64 Encode", key: "Base64" },
    { name: "Base64 Decode", key: "Base64Decode" },
    { name: "SHA-256 Hash", key: "Hash" },
    { name: "JSON Formatter", key: "JSON" },
    // { name: "Regex Tester", key: "Regex" },
    { name: "UUID Generator", key: "UUID" },
    { name: "Color Converter", key: "Color" }
  ];

  return (
    <div style={{ padding: "10px", width: "300px" }}>
      <h3>Tools</h3>
      {tools.map(t => (
        <button
          key={t.key}
          style={{ display: "block", marginBottom: "5px", width: "100%", textAlign: "left" }}
          onClick={() => {
            setTool(t.key);
            setInput("");
            setOutput("");
          }}
        >
          {t.name}
        </button>
      ))}

      {tool && (
        <div style={{ marginTop: "15px" }}>
          <h4>{tool}</h4>
          {tool !== "UUID" && tool !== "Color" && (
            <textarea
              rows={4}
              style={{ width: "100%", marginBottom: "10px", resize: "vertical" }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={ "여기에 입력하세요" }
            />
          )}
          {tool === "Color" && (
            <div style={{ marginBottom: "10px" }}>
              <input
                type="color"
                value={input || "#ff0000"}
                onChange={(e) => setInput(e.target.value)}
                style={{ width: "100%", height: "40px", border: "none", padding: 0, cursor: "pointer" }}
              />
            </div>
          )}
          <button onClick={runTool}>Run</button>
          <textarea
            style={{
              background: "#0c0c0c",
              color: "#fff",
              padding: "10px",
              marginTop: "10px",
              maxHeight: "200px",
              overflow: "auto",
              width: "100%",
              resize: "vertical",
              fontFamily: "monospace",
            }}
            readOnly
            value={output}
          />
        </div>
      )}
    </div>
  );
};

export default ToolsPanel;