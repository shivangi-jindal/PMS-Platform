import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [managerId, setManagerId] = useState("");

  const handleRegister = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name,
          email,
          password,
          role,
          managerId: role === "employee" ? managerId : null,
        }
      );

      alert(res.data.message);
      window.location.href = "/";
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Register User</h2>

        <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

        <select onChange={(e) => setRole(e.target.value)}>
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>

        {role === "employee" && (
          <input
            placeholder="Manager ID"
            onChange={(e) => setManagerId(e.target.value)}
          />
        )}

        <button onClick={handleRegister}>Register</button>
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
    background: "linear-gradient(135deg, #43cea2, #185a9d)",
  },
  card: {
    width: "350px",
    padding: "25px",
    background: "white",
    borderRadius: "10px",
    textAlign: "center",
  },
};