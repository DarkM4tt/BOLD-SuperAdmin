import { createContext, useContext, useEffect, useState } from "react";
import { useCheckSessionQuery } from "../store/authApi";
import { useSnackbar } from "./SnackbarProvider";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { data, isLoading } = useCheckSessionQuery();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const showSnackbar = useSnackbar();

  useEffect(() => {
    if (!isLoading) {
      if (data?.success) {
        setIsAuthenticated(true);
        showSnackbar("Already logged in!", "success");
      } else {
        setIsAuthenticated(false);
        showSnackbar("Not logged in!", "error");
      }
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
