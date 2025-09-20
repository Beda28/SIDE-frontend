import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const GitPanel = ({ repoId }) => {
  const [status, setStatus] = useState([]);
  const [branches, setBranches] = useState([]);
  const [currentBranch, setCurrentBranch] = useState("");
  const [commitMessage, setCommitMessage] = useState("");

  const fetchStatus = async () => {
    if (!repoId) return;
    try {
      const res = await axios.get(`${API_BASE}/api/git/status?repo=${repoId}`);
      setStatus(res.data.status);
      setBranches(res.data.branches);
      setCurrentBranch(res.data.currentBranch);
    } catch (err) {
      console.error("Git status fetch failed:", err);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [repoId]);

  const Commit = async () => {
    if (!commitMessage) return alert("commit message를 입력하세요.");
    try {
      await axios.post(`${API_BASE}/api/git/commit`, {
        repo: repoId,
        message: commitMessage,
      });
      setCommitMessage("");
      fetchStatus();
      alert("commit 완료");
    } catch (err) {
      console.error(err);
      alert("commit 실패");
    }
  };

  const Push = async () => {
    try {
      await axios.post(`${API_BASE}/api/git/push`, { repo: repoId });
      alert("push 완료");
    } catch (err) {
      console.error(err);
      alert("push 실패");
    }
  };

  const Pull = async () => {
    try {
      await axios.post(`${API_BASE}/api/git/pull`, { repo: repoId });
      fetchStatus();
      alert("pull 완료");
    } catch (err) {
      console.error(err);
      alert("pull 실패");
    }
  };

  const NewBranch = async () => {
    const name = prompt("새 branch 이름:");
    if (!name) return;
    try {
      await axios.post(`${API_BASE}/api/git/branch`, { repo: repoId, name });
      fetchStatus();
      alert("branch 생성 완료");
    } catch (err) {
      console.error(err);
      alert("branch 생성 실패");
    }
  };

  const Checkout = async (branch) => {
    try {
      await axios.post(`${API_BASE}/api/git/checkout`, { repo: repoId, branch });
      fetchStatus();
      alert(`branch 변경: ${branch}`);
    } catch (err) {
      console.error(err);
      alert("branch 변경 실패");
    }
  };

  const Stash = async () => {
    try {
      await axios.post(`${API_BASE}/api/git/stash`, { repo: repoId });
      fetchStatus();
      alert("stash 완료");
    } catch (err) {
      console.error(err);
      alert("stash 실패");
    }
  };

  return (
    <div style={{ padding: "10px", fontFamily: "sans-serif" }}>
      <h3>Git</h3>

      <div style={{ marginBottom: "10px" }}>
        <strong>Current branch:</strong> {currentBranch}
      </div>

      <div style={{ marginBottom: "10px" }}>
        <button onClick={Pull}>Pull</button>
        <button onClick={Push} style={{ marginLeft: "5px" }}>Push</button>
        <button onClick={Stash} style={{ marginLeft: "5px" }}>Stash</button>
        <button onClick={NewBranch} style={{ marginLeft: "5px" }}>New Branch</button>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <select
          value={currentBranch}
          onChange={(e) => Checkout(e.target.value)}
        >
          {branches.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Commit message"
          value={commitMessage}
          onChange={(e) => setCommitMessage(e.target.value)}
          style={{ width: "100%" }}
        />
        <button onClick={Commit} style={{ marginTop: "5px", width: "100%" }}>
          Commit
        </button>
      </div>

      <div>
        <h4>Changes</h4>
        <ul>
          {status.map((f) => (
            <li key={f.file}>
              {f.file} ({f.type})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GitPanel;