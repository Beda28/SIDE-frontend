import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AddRepoModal from "../components/AddRepoModal.jsx";
import axios from "axios";

export default function RepositoryPage() {
  const [showModal, setShowModal] = useState(false);
  const [username, setusername] = useState('');
  const [list, setlist] = useState([]);

  const getid = async () => {
    const res = await axios.get('http://localhost:4184/api/user/getid', { withCredentials: true })
    setusername(res.data)
  }

  const getrepo = async () => {
    const res = await axios.get('http://localhost:4184/api/repo/getrepo', { withCredentials: true })
    if (res.data){
      setlist(res.data)
    } 
  }

  useEffect(() => {
    getid()
    getrepo()
  }, [])

  return (
    <div style={{ padding: "20px" }}>
      <h1>repo</h1>
      <button onClick={() => setShowModal(true)}>New</button>
      <br /><br />
      <Link to="/ide/123">
        <button>IDE</button>
      </Link>

      <p>{username}</p>
      <div style={{ display: "flex", flexWrap: "wrap"}}>
        {list.map((value, index) => {
          return <>
            <div key={index} style={{ margin: "30px", border: "1px solid black"}}>
              <p>full_name: {value.full_name}</p>
              <p>owner: {value.owner}</p>
              {value.description ? <p>desc: {value.description}</p> : ""}
            </div>  
          </>
        })}
      </div>

      {showModal && <AddRepoModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
