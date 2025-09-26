import React, { useState } from "react";
import { useAuth } from "../../context/auth.context";
import type { User } from "../../types";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Alert, AlertDescription } from "../../components/ui/alert";
import {
  X,
  Save,
  User as UserIcon,
  Building2,
  LogOut,
  Camera,
  CheckCircle,
} from "lucide-react";

const Profile: React.FC = () => {
  const { authState, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({
    nama: authState.user?.nama || "",
    alamat: authState.user?.alamat || "",
    nomor_rumah: authState.user?.nomor_rumah || "",
    nomor_hp: authState.user?.nomor_hp || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError("");

    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error: any) {
      setError(error.response?.data?.detail || "Gagal memperbarui profil");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      nama: authState.user?.nama || "",
      alamat: authState.user?.alamat || "",
      nomor_rumah: authState.user?.nomor_rumah || "",
      nomor_hp: authState.user?.nomor_hp || "",
    });
    setIsEditing(false);
    setError("");
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-green-600 to-green-700 text-white  overflow-hidden mb-6">
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute top-0 right-0 -mt-4 -mr-16 w-32 h-32 bg-white/10 rounded-full"></div>

        <div className="relative p-4 md:p-6">
          {/* Branding Section - Hidden on mobile, visible on desktop */}
          <div className="hidden md:flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Manajemen IPL</h1>
              <p className="text-green-100 text-sm">
                Sistem Pembayaran Digital
              </p>
            </div>
          </div>

          {/* Compact Mobile Header - Only visible on mobile */}
          <div className="md:hidden flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold">IPL Cluster Cannary</span>
            </div>
          </div>

          {/* Enhanced Greeting Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-4 shadow-lg">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-white/20 rounded-full">
                  <UserIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-semibold mb-1">
                    Halo, {authState.user?.nama}! 👋
                  </h2>
                  <p className="text-green-100 text-xs md:text-sm">
                    Kelola IPL Anda dengan mudah
                  </p>
                </div>
              </div>
              {/* Desktop notification button - hidden on mobile */}
              <div className="hidden md:block relative">
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20">
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 -mt-2">
        {/* Profile Header */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white/60">
                  <UserIcon className="w-9 h-9 md:w-11 md:h-11 text-white" />
                </div>
                <Button
                  size="icon"
                  className="absolute -bottom-1 -right-1 w-7 h-7 md:w-9 md:h-9 bg-green-600 hover:bg-green-700 rounded-full shadow-lg">
                  <Camera className="w-4 h-4 text-white" />
                </Button>
              </div>
              <div className="flex-1 min-w-0 w-full">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 truncate">
                  {authState.user?.nama}
                </h2>
                <Badge
                  variant={authState.user?.is_admin ? "secondary" : "outline"}
                  className={`mt-2 px-2 py-1 text-xs ${
                    authState.user?.is_admin
                      ? "bg-purple-100 text-purple-800 border-purple-200"
                      : "bg-blue-100 text-blue-800 border-blue-200"
                  }`}>
                  {authState.user?.is_admin ? "Administrator" : "Warga"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informasi Pribadi */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-blue-600" />
              Informasi Pribadi
            </CardTitle>
            <CardDescription>Ubah detail profil Anda</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-4">
              <Input
                type="text"
                value={authState.user?.username || ""}
                disabled
                className="bg-gray-50"
              />
              <Input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <Textarea
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <Input
                type="text"
                name="nomor_rumah"
                value={formData.nomor_rumah}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <Input
                type="tel"
                name="nomor_hp"
                value={formData.nomor_hp}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            {isEditing && (
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "Menyimpan..." : "Simpan"}
                </Button>
                <Button onClick={handleCancel} variant="secondary">
                  <X className="w-4 h-4 mr-2" /> Batal
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Informasi Akun */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Informasi Akun
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Status: {authState.user?.is_admin ? "Administrator" : "Warga"}
            </p>
            <p>
              Bergabung:{" "}
              {new Date(authState.user?.created_at || "").toLocaleDateString(
                "id-ID",
                { year: "numeric", month: "long", day: "numeric" }
              )}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
