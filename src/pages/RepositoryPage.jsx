import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AddRepoModal from "../components/AddRepoModal.jsx";
import SelectTypeModal from "../components/SelectTypeModal.jsx";
import axios from "axios";
import GitHubCalendar from "react-github-calendar";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const RepositoryPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [username, setusername] = useState("");
  const [list, setlist] = useState([]);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!showModal) getrepo();
  }, [showModal]);

  const getid = async () => {
    const res = await axios.get(`${API_BASE}/api/user/getid`, {
      withCredentials: true,
    });
    if (res.data) 
      setusername(res.data);
    else {
      alert("로그인 해주세요"); 
      navigate("/");
    }
  };

  const getrepo = async () => {
    const res = await axios.get(`${API_BASE}/api/repo/getrepo`, {
      withCredentials: true,
    });
    if (res.data) {
      setlist(res.data);
    }
  };

  const getprofile = async (username) => {
    const res = await axios.get(`https://api.github.com/users/${username}`);
    setUserData(res.data);
  };

  useEffect(() => {
    getid();
    // getrepo();
  }, []);

  useEffect(() => {
    if (username) {
      getprofile(username);
    }
  }, [username]);

  const selectLastHalfYear = (contributions) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const shownMonths = 5;

    return contributions.filter((day) => {
      const date = new Date(day.date);
      const monthOfDay = date.getMonth();

      if (currentMonth >= 5) {
        return (
          date.getFullYear() === currentYear &&
          monthOfDay > currentMonth - shownMonths &&
          monthOfDay <= currentMonth
        );
      }

      return (
        (date.getFullYear() === currentYear && monthOfDay <= currentMonth) ||
        (date.getFullYear() === currentYear - 1 &&
          monthOfDay > currentMonth + 11 - shownMonths)
      );
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>repo</h1>
      <button onClick={() => setShowModal(true)}>New</button>
      <br />
      <br />

      <div>
        {userData && (
          <>
            <img
              src={userData.avatar_url}
              style={{
                width: "250px",
                height: "250px",
                borderRadius: "50%",
              }}
            />
            <p>{userData.name}</p>
            <p>{username}</p>
            <GitHubCalendar
              username={username}
              transformData={selectLastHalfYear}
            />
            <p>total: {list.length}</p>
          </>
        )}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {list.map((value, index) => {
          return (
            <div
              key={index}
              style={{
                margin: "30px",
                border: "1px solid black",
                padding: "10px",
              }}
            >
              <p>full_name: {value.full_name}</p>
              <p>owner: {value.owner}</p>
              {value.description ? <p>desc: {value.description}</p> : ""}
              <div
                onClick={() =>
                  window.open(`https://github.com/${value.full_name}`)
                }
              >
                깃허브 바로가기
              </div>
              <div onClick={() => navigate(`/tree/${value.full_name}`)}>
                트리 보러가기
              </div>
              <div
                onClick={() => {
                  setSelectedRepo(value.full_name);
                  setShowTypeModal(true);
                }}
              >
                ide에서 보기
              </div>
            </div>
          );
        })}
      </div>

      {showModal && <AddRepoModal onClose={() => setShowModal(false)} />}
      {showTypeModal && (
        <SelectTypeModal
          onClose={() => setShowTypeModal(false)}
          onSelect={(type) =>
            navigate(`/ide/${selectedRepo.replace("/", "_")}?type=${type}`)
          }
        />
      )}
    </div>
  );
}

export default RepositoryPage;