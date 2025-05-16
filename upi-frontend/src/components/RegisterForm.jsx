import { useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [vpa, setVpa] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    try {
      await api.post("/users/register", { name, vpa });
      setMessage("User registered successfully");
    } catch (err) {
      setMessage(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />

      <input
        type="text"
        value={vpa}
        onChange={(e) => setVpa(e.target.value)}
        placeholder="VPA (e.g. alice@upi)"
      />

      <button onClick={handleRegister}>Register</button>

      {message && (
        <p className={`message ${message.toLowerCase().includes("success") ? "success" : "error"}`}>
          {message}
        </p>
      )}

      <p className="link-text">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}
