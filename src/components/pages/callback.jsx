import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Callback = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState('로그인 처리 중...');
    
    const hasRequested = useRef(false);

    useEffect(() => {
        if (hasRequested.current) {
            return;
        }

        hasRequested.current = true;
        
        const fetchAccessToken = async () => {
            const url = new URL(window.location.href);
            const authorizationCode = url.searchParams.get("code");
            
            if (!authorizationCode) {
                setStatus("로그인 실패: 인증 코드가 없습니다.");
                setTimeout(() => navigate('/'), 3000);
                return;
            }

            try {
                const res = await axios.post('http://localhost:4184/api/user/login', {
                    code: authorizationCode
                });
                
                if (res.data.success) {
                    setStatus("로그인 성공!");
                    setTimeout(() => navigate('/'), 2000);
                } else {
                    setStatus("로그인 실패: 서버 응답 오류");
                    setTimeout(() => navigate('/'), 3000);
                }
            } catch (error) {
                console.error("로그인 요청 실패:", error);
                setStatus("네트워크 오류 또는 서버 연결 실패");
                setTimeout(() => navigate('/'), 3000);
            }
        };

        fetchAccessToken();
    }, [navigate]);

    return (
        <div>
            <p>{status}</p>
        </div>
    );
};