import { Navigate } from "react-router-dom";

const RootHandler = () => {
  const isAuthenticated = localStorage.getItem("user");

  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};

export default RootHandler;
