import { createContext, useContext, useEffect, useState } from "react";
import { useCheckSessionQuery } from "../store/authApi";
import { useSnackbar } from "./SnackbarProvider";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { data, isLoading } = useCheckSessionQuery();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const showSnackbar = useSnackbar();

  useEffect(() => {
    if (!isLoading && data?.success) {
      setIsAuthenticated(true);
      showSnackbar("Logged in!", "success");
    } else {
      setIsAuthenticated(false);
      showSnackbar("Not logged in!", "error");
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
