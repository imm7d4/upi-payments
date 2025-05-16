import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";
import AuthContext from "../context/AuthContext";
import "./Transactions.css";

function getInitials(vpa) {
  if (!vpa) return "";
  return vpa.charAt(0).toUpperCase();
}

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState("all");
  const [searchVPA, setSearchVPA] = useState("");

  const [debouncedSearchVPA, setDebouncedSearchVPA] = useState(searchVPA);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchVPA(searchVPA), 300);
    return () => clearTimeout(handler);
  }, [searchVPA]);

  const fetchTransactions = async () => {
    try {
      const res = await api.get(`/transactions/history`, {
        params: { type: filterType, search: debouncedSearchVPA },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTransactions(res.data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchTransactions();
  }, [user, filterType, debouncedSearchVPA]);

  const handleClickTo = (vpa) => {
    if (vpa !== user.vpa) {
      navigate(`/send-money?to=${encodeURIComponent(vpa)}`);
    }
  };

  return (
    <div className="container">
      <h2>Transaction History</h2>

      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="filter">Show: </label>
        <select
          id="filter"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All</option>
          <option value="sent">Sent</option>
          <option value="received">Received</option>
        </select>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="searchVPA">Search VPA: </label>
        <input
          id="searchVPA"
          type="text"
          value={searchVPA}
          onChange={(e) => setSearchVPA(e.target.value)}
          placeholder="Enter VPA to search"
        />
      </div>

      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <ul className="tx-list">
          <AnimatePresence>
            {transactions.map((tx) => {
              const isSent = tx.from === user.vpa;
              return (
                <motion.li
                  key={tx._id}
                  initial={{ opacity: 0, x: isSent ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isSent ? 50 : -50 }}
                  transition={{ duration: 0.5 }}
                  className={`tx-item ${isSent ? "sent" : "received"}`}
                >
                  <div
                    className="avatar from"
                    onClick={() => tx.from !== user.vpa && handleClickTo(tx.from)}
                    style={{ cursor: tx.from !== user.vpa ? "pointer" : "default" }}
                    title={tx.from !== user.vpa ? `Send money to ${tx.from}` : ""}
                  >
                    {getInitials(tx.from)}
                  </div>

                  <div className="details">
                    <div>
                      <span
                        className="clickable"
                        onClick={() => tx.from !== user.vpa && handleClickTo(tx.from)}
                        style={{
                          cursor: tx.from !== user.vpa ? "pointer" : "default",
                          color: tx.from !== user.vpa ? "blue" : "black",
                          textDecoration: tx.from !== user.vpa ? "underline" : "none",
                          marginRight: "4px",
                        }}
                        title={tx.from !== user.vpa ? `Send money to ${tx.from}` : ""}
                      >
                        {tx.from}
                      </span>
                      ➡
                      <span
                        className="clickable"
                        onClick={() => tx.to !== user.vpa && handleClickTo(tx.to)}
                        style={{
                          cursor: tx.to !== user.vpa ? "pointer" : "default",
                          color: tx.to !== user.vpa ? "blue" : "black",
                          textDecoration: tx.to !== user.vpa ? "underline" : "none",
                          marginLeft: "4px",
                        }}
                        title={tx.to !== user.vpa ? `Send money to ${tx.to}` : ""}
                      >
                        {tx.to}
                      </span>
                      :
                    </div>
                    <div>
                      <strong>
                        ₹{tx.amount % 1 === 0 ? tx.amount.toString() : tx.amount.toFixed(2)}
                      </strong>
                      {tx.cashback && tx.cashback > 0 && (
                        <span
                          style={{ color: "green", marginLeft: "10px", fontWeight: "bold" }}
                        >
                          + Cashback ₹{tx.cashback.toFixed(2)}
                        </span>
                      )}
                      {" "}on {new Date(tx.timestamp).toLocaleString()}
                    </div>
                    <div style={{ color: "gray", fontSize: "small" }}>
                      Txn Ref: {tx.txnRef && tx.txnRef.trim() !== "" ? tx.txnRef : "NA"}
                    </div>
                  </div>

                  <div
                    className="avatar to"
                    onClick={() => tx.to !== user.vpa && handleClickTo(tx.to)}
                    style={{ cursor: tx.to !== user.vpa ? "pointer" : "default" }}
                    title={tx.to !== user.vpa ? `Send money to ${tx.to}` : ""}
                  >
                    {getInitials(tx.to)}
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
