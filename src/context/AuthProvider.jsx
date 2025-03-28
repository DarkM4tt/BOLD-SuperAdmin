import { createContext, useContext, useEffect, useState } from "react";
import { useCheckSessionQuery } from "../store/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { data, isLoading } = useCheckSessionQuery();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!isLoading && data?.success) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [data, isLoading]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, setIsAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
