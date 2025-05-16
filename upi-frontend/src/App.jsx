import { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import AuthContext, { AuthProvider } from "./context/AuthContext";

import RegisterForm from "./components/RegisterForm";
import UserSettings from "./components/UserSetting";
import SendMoneyForm from "./components/SendMoneyForm";
import TransactionHistory from "./components/TransactionHistory";
import LoginForm from "./components/LoginForm";
import Navbar from "./components/Navbar";
import RecentSentVPAs from "./components/Recents";
import Goodbye from "./components/Goodbye";
function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
}

function App() {

  return (
    
      <div style={{ maxWidth: "1500px", margin: "auto", padding: 20 }}>
        
        <Navbar />
        <Routes>
          <Route path="/" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/recents" element={<RecentSentVPAs />} />
          <Route path="/goodbye" element={<Goodbye />} />
          <Route
            path="/set-pin"
            element={
              <PrivateRoute>
                <UserSettings />
              </PrivateRoute>
            }
          />
          <Route
            path="/send-money"
            element={
              <PrivateRoute>
                <SendMoneyForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <PrivateRoute>
                <TransactionHistory />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    
  );
}

export default function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
