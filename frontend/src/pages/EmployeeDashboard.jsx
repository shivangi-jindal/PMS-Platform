import { useState, useEffect } from "react";
import axios from "axios";

export default function EmployeeDashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [weightage, setWeightage] = useState("");
  const [goals, setGoals] = useState([]);

  const token = localStorage.getItem("token");

  // 🔥 Load goals
  const fetchGoals = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/goals/my", {
        headers: {
          Authorization: token,
        },
      });

      setGoals(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  // 🔥 Create goal
  const createGoal = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/goals/create",
        {
          title,
          description,
          weightage: Number(weightage),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Goal created");

      setTitle("");
      setDescription("");
      setWeightage("");

      fetchGoals();
    } catch (err) {
      alert(err.response?.data?.error || "Error creating goal");
    }
  };

  return (
    <div style={styles.container}>
      <h1>👨‍💻 Employee Dashboard</h1>

      {/* CREATE GOAL */}
      <div style={styles.card}>
        <h2>Create Goal</h2>

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Weightage (%)"
          value={weightage}
          onChange={(e) => setWeightage(e.target.value)}
          style={styles.input}
        />

        <button onClick={createGoal} style={styles.button}>
          Create Goal
        </button>
      </div>

      {/* GOAL LIST */}
      <div style={styles.card}>
        <h2>My Goals</h2>

        {goals.length === 0 ? (
          <p>No goals yet</p>
        ) : (
          goals.map((g) => (
            <div key={g.id} style={styles.goal}>
              <h3>{g.title}</h3>
              <p>{g.description}</p>
              <p>Progress: {g.progress || 0}%</p>
              <p>Status: {g.status}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial",
  },
  card: {
    padding: "20px",
    margin: "20px 0",
    border: "1px solid #ddd",
    borderRadius: "10px",
  },
  input: {
    display: "block",
    width: "100%",
    padding: "10px",
    margin: "10px 0",
  },
  button: {
    padding: "10px 20px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  goal: {
    padding: "10px",
    borderBottom: "1px solid #eee",
  },
};