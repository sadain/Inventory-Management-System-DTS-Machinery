import React, { createContext, useContext, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setCookie, getCookieValue } from "api/constants";
import jwt_decode from "jwt-decode";
import { toast } from "react-toastify";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  let accessToken = getCookieValue("dtstoken");
  let decodedToken = getCookieValue("decodedToken");

  const login = async (token) => {
    setCookie("dtstoken", token);
    const decoded = jwt_decode(token);
    setCookie("decodedToken", JSON.stringify(decoded));
    accessToken = token;
    decodedToken = JSON.stringify(decoded);
    navigate("/dashboard");
  };

  const logout = () => {
    setCookie("dtstoken", "");
    setCookie("decodedToken", "");
    localStorage.removeItem("selectedCompanyId");
    navigate("/login", { replace: true });
    toast.success("You have Logout Successfully");
  };

  useEffect(() => {
    const checkTokenExpiration = () => {
      if (accessToken) {
        const decodedToken = jwt_decode(accessToken);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          logout();
          toast.error("Session expired, please login again");
        }
      }
    };

    checkTokenExpiration();

  }, [accessToken]);

  const value = useMemo(
    () => ({
      accessToken,
      decodedToken,
      login,
      logout,
    }),
    [accessToken, decodedToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
