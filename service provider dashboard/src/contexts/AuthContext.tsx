import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";

type User = {
  name?: string;
  email: string;
  phone?: string;
  servicesOffered?: string[];
} | null;

interface AuthContextType {
  user: User;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      const token = Cookies.get("accessToken");

      if (!token) {
        console.warn("No access token found.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("https://resqtrackbackend.onrender.com/api/user/getprofiledetails", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const userData = await response.json();
        if (userData?.finduser) {
          setUser(userData.finduser);
          setIsAuthenticated(true);
          localStorage.setItem("user", JSON.stringify(userData.finduser));
        } else {
          console.warn("User data not found in API response.");
          setUser(null); // Ensure user is null if API response is incorrect
          setIsAuthenticated(false);
        }
      } catch (err: any) {
        console.error("Error fetching user data:", err.message);
        setError(err.message);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
        setLoading(false); // Ensure loading is set to false
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem("user");
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
      }
    } else {
      fetchUserProfile(); // Call API only if no user is found in localStorage
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    Cookies.remove("accessToken"); // Remove token on logout
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
