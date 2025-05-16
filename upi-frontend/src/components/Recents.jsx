import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import AuthContext from "../context/AuthContext";
import "./Recents.css"; 
export default function RecentSentVPAs({ maxItems = 5 }) {
  const { user } = useContext(AuthContext);
  const [sentVPAs, setSentVPAs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchSentVPAs = async () => {
      try {
        const res = await api.get("/transactions/history", {
          params: { type: "sent" },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const uniqueVPAs = [];
        for (const tx of res.data) {
          if (!uniqueVPAs.includes(tx.to)) {
            uniqueVPAs.push(tx.to);
          }
          if (uniqueVPAs.length >= maxItems) break;
        }

        setSentVPAs(uniqueVPAs);
      } catch (err) {
        console.error("Failed to fetch recent sent VPAs", err);
      }
    };

    fetchSentVPAs();
  }, [user, maxItems]);

  const handleClick = (vpa) => {
    navigate(`/send-money?to=${encodeURIComponent(vpa)}`);
  };

  if (sentVPAs.length === 0) return null;

  return (
    <>
      <style>{`
        .recent-vpa-container {
          display: flex;
          gap: 25px;
          flex-wrap: wrap;
          justify-content: center;
          margin: 20px 0;
        }
        .recent-vpa-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          user-select: none;
          width: 80px;
        }
        .recent-vpa-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 2px solid #007bff;
          background-color: #e7f1ff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #007bff;
          transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
          box-shadow: none;
          margin-bottom: 6px;
        }
        .recent-vpa-item:hover .recent-vpa-circle {
          background-color: #cde0ff;
          box-shadow: 0 0 8px rgba(0, 123, 255, 0.5);
          transform: scale(1.1);
        }
        .recent-vpa-label {
          font-weight: 600;
          font-size: 14px;
          color: #007bff;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
        }
      `}</style>

      <div>
        <h3 style={{ textAlign: "center", color: "#007bff", fontWeight: "700" }}>
          Recent Payees
        </h3>
        <div className="recent-vpa-container">
          {sentVPAs.map((vpa, index) => (
            <div
              key={vpa}
              className="circle animated-circle"
              style={{ "--i": index }}
              onClick={() => handleClick(vpa)}
              title={`Send money to ${vpa}`}
            >
              <i className="fa fa-internet-explorer" aria-hidden="true"></i>
              <div className="vpa-text">{vpa}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
