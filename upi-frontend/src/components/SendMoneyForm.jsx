import { useState, useEffect, useContext } from "react";
import api from "../api";
import { useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function SendMoneyForm() {
  const { user } = useContext(AuthContext);
  const [toVPA, setToVPA] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const toParam = params.get("to");
    if (toParam) setToVPA(toParam);
  }, [location.search]);

  const handleSendMoney = async () => {
    try {
      await api.post("/transactions/send", {
        fromVPA: user?.vpa,
        toVPA,
        amount: Number(amount),
        pin,
      });
      setMessage("Transaction successful");
    } catch (err) {
      setMessage(err.response?.data?.error || "Transaction failed");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <h2>Send Money</h2>

      <div style={{ marginBottom: "1rem" }}>
        <label
          htmlFor="fromVPA"
          style={{ fontWeight: "bold", display: "block", marginBottom: "4px" }}
        >
          From VPA:
        </label>
        <div
          id="fromVPA"
          style={{
            padding: "8px 12px",
            backgroundColor: "#f0f0f0",
            borderRadius: "4px",
            fontFamily: "monospace",
            fontSize: "1.1rem",
            color: "#333",
            userSelect: "all",
            width: "fit-content",
          }}
        >
          {user?.vpa || "Loading..."}
        </div>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label
          htmlFor="toVPA"
          style={{ fontWeight: "bold", display: "block", marginBottom: "4px" }}
        >
          To VPA:
        </label>
        <input
          id="toVPA"
          type="text"
          placeholder="Enter recipient VPA"
          value={toVPA}
          onChange={(e) => setToVPA(e.target.value)}
          style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label
          htmlFor="amount"
          style={{ fontWeight: "bold", display: "block", marginBottom: "4px" }}
        >
          Amount (₹):
        </label>
        <input
          id="amount"
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          min="1"
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label
          htmlFor="pin"
          style={{ fontWeight: "bold", display: "block", marginBottom: "4px" }}
        >
          UPI PIN:
        </label>
        <input
          id="pin"
          type="password"
          placeholder="Enter your UPI PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
      </div>

      <button
        onClick={handleSendMoney}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#007bff",
          color: "#fff",
          fontWeight: "bold",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Send
      </button>

      {message && (
        <p
          style={{
            marginTop: "1rem",
            padding: "8px",
            borderRadius: "4px",
            backgroundColor: message.includes("successful") ? "#d4edda" : "#f8d7da",
            color: message.includes("successful") ? "#155724" : "#721c24",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}
