import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export const ProtectedRoute = ({ children }) => {
  const { accessToken } = useAuth();

  if (accessToken === "") {
    return <div>Loading...</div>;
  }

  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  return children;
};