import axios from "axios";
import React, { useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function AddRepoModal({ onClose }) {
  const [reponame, setreponame] = useState('');
  const [desc, setdesc] = useState('');
  const [priv, setpriv] = useState(false);

  const sendpost = async () => {
    const reg = /[^a-zA-Z0-9]/
    if (reg.test(reponame)) return alert("한글 못씀")

    await axios.post(`${API_BASE}/api/repo/createrepo`, {
      name: reponame,
      desc: desc,
      priv: priv
    }, { withCredentials: true })
  }

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex", justifyContent: "center", alignItems: "center"
    }}>
      <div style={{ background: "white", padding: "20px", borderRadius: "8px", minWidth: "300px" }}>
        <h2>Add Repository</h2>
        <input type="text" placeholder="Repository Name" value={reponame} onChange={(e) => {setreponame(e.target.value)}} style={{ width: "100%", marginBottom: "10px" }} />
        <input type="text" placeholder="Description" value={desc} onChange={(e) => {setdesc(e.target.value)}} style={{ width: "100%", marginBottom: "10px" }} />
          <p onClick={() => {setpriv(true)}}>Public</p>
          <p onClick={() => {setpriv(false)}}>Private</p>
        <br />
        <button onClick={async () => { await sendpost(); onClose()}}>Create</button> 
        <button onClick={async () => { onClose()}}>Close</button>
      </div>
    </div>
  );
}
