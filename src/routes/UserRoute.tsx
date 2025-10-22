import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";

interface UserRouteProps {
  children: React.ReactNode;
}

const UserRoute: React.FC<UserRouteProps> = ({ children }) => {
  const { authState } = useAuth();

  if (!authState.user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default UserRoute;
