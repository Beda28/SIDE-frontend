import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function LoginButton() {
  const [login, setlogin] = useState()

  useEffect(() => {
    getId()
  }, [])

  const getId = async () => {
    const res = await axios.get(`${API_BASE}/api/user/getid`, {
      withCredentials: true,
    });
    if (res.data) setlogin(true)
    else setlogin(false)
  }

  const loginWithGithub = () => {
    window.location.assign(
      `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo`
    );
  };

  const logout = async () => {
    await axios.get(`${API_BASE}/api/user/logout`, {
      withCredentials: true,
    });
    setlogin(false)
  }

  return <>
    {login ? 
      <button style={styles.button} onClick={logout}>로그아웃</button> :
      <button style={styles.button} onClick={loginWithGithub}>GitHub 로그인</button>
    }
  </>
}

const styles = {
  button: {
    padding: "10px 20px",
    fontSize: "1rem",
    cursor: "pointer",
    border: "1px solid #ccc",
    borderRadius: "6px",    
    backgroundColor: "#f5f5f5",
    transition: "all 0.2s ease-in-out",
  },
};