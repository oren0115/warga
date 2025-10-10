import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import { Shield, ArrowLeft, Home, AlertTriangle } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import PageLayout from "../components/common/PageLayout";
import PageHeader from "../components/common/PageHeader";

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  const { authState, logout } = useAuth();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    if (authState.user?.is_admin) {
      navigate("/admin/dashboard");
    } else {
      navigate("/");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <PageLayout>
      {/* Consistent Page Header */}
      <PageHeader
        title="Akses Ditolak"
        subtitle="Anda tidak memiliki izin untuk mengakses halaman ini"
        icon={<Shield className="w-5 h-5 md:w-6 md:h-6 text-white" />}
        userName={authState.user?.nama}
      />

      <div className="p-4 flex items-center justify-center min-h-[60vh]">
        <Card className="w-full shadow-2xl border-0 bg-white/80 backdrop-blur-sm rounded-2xl">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-red-100 to-red-200 rounded-full w-20 h-20 flex items-center justify-center">
              <Shield className="w-10 h-10 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
              Akses Ditolak
            </CardTitle>
            <p className="text-gray-600 text-sm leading-relaxed">
              Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.
              Halaman ini hanya dapat diakses oleh Administrator.
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* User Info */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-white">
                    {authState.user?.nama?.charAt(0) || "U"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {authState.user?.nama || "User"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {authState.user?.is_admin ? "Administrator" : "Warga"}
                  </p>
                </div>
              </div>
            </div>

            {/* Warning Message */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800 mb-1">Perhatian</p>
                  <p className="text-yellow-700">
                    Jika Anda yakin seharusnya memiliki akses admin, silakan
                    hubungi administrator sistem.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleGoHome}
                className="w-full cursor-pointer bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-md hover:shadow-lg">
                <Home className="w-4 h-4" />
                <span>Kembali ke Dashboard</span>
              </Button>

              <Button
                onClick={handleGoBack}
                variant="outline"
                className="w-full cursor-pointer border-gray-300 text-gray-700 hover:bg-gray-200 hover:text-gray-700 font-medium py-3 rounded-xl transition-colors flex items-center justify-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Halaman Sebelumnya</span>
              </Button>

              <Button
                onClick={handleLogout}
                variant="ghost"
                className="w-full cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-700 font-medium py-2 rounded-xl transition-colors">
                Keluar dari Akun
              </Button>
            </div>

            {/* Help Text */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Butuh bantuan? Hubungi administrator sistem
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default UnauthorizedPage;
