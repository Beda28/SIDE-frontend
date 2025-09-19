import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Callback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("로그인 처리 중..");
  const hasRequested = useRef(false);

  useEffect(() => {
    if (hasRequested.current) return;
    hasRequested.current = true;

    const fetchAccessToken = async () => {
      const url = new URL(window.location.href);
      const authorizationCode = url.searchParams.get("code");

      if (!authorizationCode) {
        setStatus("로그인 실패: 인증 코드가 없습니다.");
        setTimeout(() => navigate("/"), 3000);
        return;
      }

      try {
        const res = await axios.post(`${API_BASE}/api/user/login`, 
          { code: authorizationCode },
          { withCredentials: true }
        );

        if (res.data.success) {
          setStatus("로그인 성공!");
          setTimeout(() => navigate("/"), 2000);
        } else {
          setStatus("로그인 실패: 서버 응답 오류");
          setTimeout(() => navigate("/"), 3000);
        }
      } catch (error) {
        console.error("로그인 요청 실패:", error);
        setStatus("네트워크 오류 또는 서버 연결 실패");
        setTimeout(() => navigate("/"), 3000);
      }
    };

    fetchAccessToken();
  }, [navigate]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{status}</p>
    </div>
  );
};

export default Callback;