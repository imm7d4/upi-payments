import { useState, useContext } from "react";
import api from "../api";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
export default function LoginForm() {
    const [vpa, setVpa] = useState("");
    const [pin, setPin] = useState("");
    const [error, setError] = useState("");
    const { login } = useContext(AuthContext);

    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await api.post("/auth/login", { vpa, pin });
            login(res.data.token, res.data.vpa);
            setError("");
            navigate("/recents"); // 👈 Redirect after successful login
        } catch (err) {
            setError(err.response?.data?.error || "Login failed");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <input placeholder="VPA" value={vpa} onChange={e => setVpa(e.target.value)} />
            <input
                placeholder="PIN"
                type="password"
                value={pin}
                onChange={e => setPin(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <p>
                Don’t have an account? <Link to="/">Register here</Link>
            </p>
        </div>
    );
}
