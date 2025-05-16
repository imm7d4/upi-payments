import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react"; // or just import QRCode
import { NavLink, useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import api from "../api";
import "../styles/Navbar.css";
export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();

    const [time, setTime] = useState("");
    const [balance, setBalance] = useState(null);
    const [showQRModal, setShowQRModal] = useState(false);

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            const formatted = now.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            });
            setTime(formatted);
        };
        updateClock();
        const interval = setInterval(updateClock, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const res = await api.get("/users/balance", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setBalance(res.data.balance);
            } catch (err) {
                console.error("Error fetching balance:", err);
            }
        };

        if (user) {
            fetchBalance();
        }
    }, [user]);

    const hideNav = ["/login", "/", "/goodbye"].includes(location.pathname);
    if (hideNav) return null;

    return (
        <>
            <nav className="navbar">
                <div className="nav-left">
                    <span className="logo">UPI Pay</span>
                    {user && (
                        <>
                            <NavLink
                                to="/send-money"
                                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                            >
                                Send Money
                            </NavLink>
                            <NavLink
                                to="/transactions"
                                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                            >
                                Transactions
                            </NavLink>
                            <NavLink
                                to="/set-pin"
                                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                            >
                                Settings
                            </NavLink>
                        </>
                    )}
                </div>
                {user && (
                    <div className="nav-right">
                        <span className="clock">{time}</span>

                        {/* Clickable VPA to open QR modal */}
                        <span
                            className="user-info clickable-vpa"
                            title="Click to view QR code"
                            onClick={() => setShowQRModal(true)}
                        >
                            {user.name} ({user.vpa})
                        </span>

                        {balance !== null && (
                            <span className="balance-display">
                                ₹{balance % 1 === 0 ? balance.toString() : balance.toFixed(2)}
                            </span>
                        )}
                        <button onClick={logout} className="logout-btn">
                            Logout
                        </button>
                    </div>
                )}
            </nav>

            {/* QR Code Modal */}
            {showQRModal && (
                <div className="qr-modal-overlay" onClick={() => setShowQRModal(false)}>
                    <div
                        className="qr-modal"
                        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside modal
                    >
                        <h3>Your VPA QR Code</h3>
                        <QRCodeCanvas
                            value={user.vpa}
                            size={200}
                            bgColor="#ffffff"
                            fgColor="#000000"
                            level="H"
                            includeMargin={true}
                        />
                        <p>{user.vpa}</p>
                        <button onClick={() => setShowQRModal(false)} className="close-btn">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
