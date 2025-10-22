// components/UserRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import { Loader2 } from "lucide-react";

export const UserRoute = ({ children }: { children: React.ReactNode }) => {
  const { authState } = useAuth();

  if (authState.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <Loader2 className="w-12 h-12 animate-spin text-green-600" />
              <div className="absolute inset-0 w-12 h-12 border-4 border-green-100 rounded-full"></div>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900 mb-1">
                Memverifikasi Akses User
              </p>
              <p className="text-sm text-gray-500">Mohon tunggu sebentar...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!authState.token) {
    return <Navigate to="/login" replace />;
  }

  // Jika user adalah admin, redirect ke dashboard admin
  if (authState.user?.is_admin === true) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};
