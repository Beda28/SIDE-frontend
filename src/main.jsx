import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";

import MainPage from "./pages/MainPage";
import Callback from "./components/Callback";
import RepositoryPage from "./pages/RepositoryPage";
import IDEPage from "./pages/IDEPage";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/repositories" element={<RepositoryPage />} />
        <Route path="/ide/:id" element={<IDEPage />} />
      </Routes>
    </Router>
  // </StrictMode>
);
