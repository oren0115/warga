// components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { authState } = useAuth();

  if (authState.isLoading) {
    return <div>Loading...</div>;
  }

  if (!authState.token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
