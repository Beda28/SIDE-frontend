import { useNavigate } from "react-router-dom";
import LoginButton from "../components/LoginButton";

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>SIDE</h1>
      <div style={styles.buttonGroup}>
        <button style={styles.button} onClick={() => navigate("/repositories")}>
          저장소 보기
        </button>
        <LoginButton />
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "20px",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
  },
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

export default MainPage;