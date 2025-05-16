import { createContext, useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
    const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUser({ vpa: decoded.vpa, token });
    }
  }, []);

  const login = (token, vpa) => {
    localStorage.setItem("token", token);
    setUser({ vpa, token });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/goodbye");
    
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
