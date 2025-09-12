import React, { useState } from "react";
import { Link } from "react-router-dom";
import AddRepoModal from "../components/AddRepoModal.jsx";

export default function RepositoryPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div style={{ padding: "20px" }}>
      <h1>repo</h1>
      <button onClick={() => setShowModal(true)}>New</button>
      <br /><br />
      <Link to="/ide/123">
        <button>IDE</button>
      </Link>

      {showModal && <AddRepoModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
