import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const token = res.data.token;

      localStorage.setItem("token", token);

      alert("Login successful");

      const payload = JSON.parse(atob(token.split(".")[1]));

      if (payload.role === "employee") {
        window.location.href = "/employee";
      } else if (payload.role === "manager") {
        window.location.href = "/manager";
      } else {
        window.location.href = "/admin";
      }
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>PMS Platform</h2>

        <input
          placeholder="Email"
          style={styles.input}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          style={styles.input}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.button} onClick={handleLogin}>
          Login
        </button>

        <a href="/register" style={styles.link}>
          Create Account
        </a>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    fontFamily: "Arial",
  },
  card: {
    width: "350px",
    padding: "30px",
    background: "white",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    background: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  link: {
    display: "block",
    marginTop: "10px",
    fontSize: "14px",
    color: "#667eea",
    textDecoration: "none",
  },
};