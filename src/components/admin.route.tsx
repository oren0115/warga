// components/AdminRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { authState } = useAuth();

  if (authState.isLoading) {
    return <div>Loading...</div>;
  }

  if (!authState.token || authState.user?.is_admin !== true) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
