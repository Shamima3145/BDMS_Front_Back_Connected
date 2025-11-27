import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create AuthContext
const AuthContext = createContext();

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [userType, setUserType] = useState(() => localStorage.getItem("userType") || "user");
  const [loading, setLoading] = useState(false);

  // Sync state with localStorage
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");

    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");

    if (userType) localStorage.setItem("userType", userType);
    else localStorage.removeItem("userType");
  }, [token, user, userType]);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", {
        email,
        password,
      });

      // Set state
      setToken(response.data.access_token);
      setUser({ email }); // optionally can include name/id
      setUserType(response.data.userType || "user");
      setLoading(false);

      return { success: true, userType: response.data.userType || "user" };
    } catch (error) {
      setLoading(false);
      return { success: false, message: error.response?.data?.message || "Login failed" };
    }
  };

  // Logout function
  const logout = () => {
    setToken(null);
    setUser(null);
    setUserType(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userType");
  };

  const value = { user, token, userType, login, logout, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
