const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;

export default function LoginButton() {
  const loginWithGithub = () => {
    window.location.assign(
      `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo`
    );
  };

  return (
    <button style={styles.button} onClick={loginWithGithub}>
      GitHub 로그인
    </button>
  );
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
