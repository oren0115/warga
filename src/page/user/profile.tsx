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
  Pencil,
  X,
  Save,
  User as UserIcon,
  Building2,
  LogOut,
  Camera,
  CheckCircle,
  Home,
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
      {/* Enhanced Header with Branding - Responsive */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-green-600 to-green-700 text-white overflow-hidden mb-6">
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute top-0 right-0 -mt-4 -mr-16 w-32 h-32 bg-white/10 rounded-full"></div>

        <div className="relative p-4 md:p-6">
          {/* Branding Section - Hidden on mobile, visible on desktop */}
          <div className="hidden md:flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Manajemen Iuran RT/RW</h1>
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
              <span className="text-lg font-semibold">RT/RW</span>
            </div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-white hover:bg-white/20 p-2">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>

          {/* Enhanced Greeting Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-4 shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
              <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                <div className="p-1.5 md:p-2 bg-white/20 rounded-full flex-shrink-0">
                  <UserIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg md:text-xl font-semibold mb-1 truncate">
                    Profil - {authState.user?.nama} 👋
                  </h2>
                  <p className="text-green-100 text-xs md:text-sm">
                    Kelola informasi profil Anda
                  </p>
                </div>
              </div>
              {/* Desktop logout button - hidden on mobile */}
              <div className="hidden md:block">
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-white hover:bg-white/20">
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 -mt-2 max-w-4xl mx-auto">
        {/* Profile Header */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <UserIcon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
                <Button
                  size="icon"
                  className="absolute -bottom-1 -right-1 w-6 h-6 md:w-8 md:h-8 bg-green-600 hover:bg-green-700 rounded-full shadow-lg">
                  <Camera className="w-3 h-3 md:w-4 md:h-4 text-white" />
                </Button>
              </div>
              <div className="flex-1 min-w-0 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 truncate">
                    {authState.user?.nama}
                  </h2>
                  <Badge
                    variant={authState.user?.is_admin ? "secondary" : "outline"}
                    className={`flex items-center gap-1 px-2 py-1 text-xs w-fit ${
                      authState.user?.is_admin
                        ? "bg-purple-100 text-purple-800 border-purple-200"
                        : "bg-blue-100 text-blue-800 border-blue-200"
                    }`}>
                    {authState.user?.is_admin ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <Home className="w-3 h-3" />
                    )}
                    {authState.user?.is_admin ? "Administrator" : "Warga"}
                  </Badge>
                </div>
                <p className="text-sm md:text-base text-gray-600 mb-1">
                  Bergabung:{" "}
                  {new Date(
                    authState.user?.created_at || ""
                  ).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-xs md:text-sm text-gray-500 truncate">
                  Username: {authState.user?.username}
                </p>
              </div>
              <div className="w-full sm:w-auto">
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? "secondary" : "default"}
                  className={`w-full sm:w-auto ${
                    isEditing ? "" : "bg-green-600 hover:bg-green-700"
                  }`}>
                  {isEditing ? (
                    <>
                      <X className="w-4 h-4 mr-2" /> Batal
                    </>
                  ) : (
                    <>
                      <Pencil className="w-4 h-4 mr-2" /> Edit
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="pb-4 px-4 md:px-6">
            <CardTitle className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-blue-600" />
              Informasi Pribadi
            </CardTitle>
            <CardDescription className="text-sm md:text-base text-gray-600">
              Ubah detail profil Anda sesuai kebutuhan
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4 md:space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 md:mb-3">
                  Username
                </label>
                <Input
                  type="text"
                  value={authState.user?.username || ""}
                  disabled
                  className="bg-gray-50 text-sm md:text-base"
                />
                <p className="text-xs text-gray-500 mt-1 md:mt-2">
                  Username tidak dapat diubah
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 md:mb-3">
                  Nama Lengkap
                </label>
                <Input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`text-sm md:text-base ${
                    !isEditing ? "bg-gray-50" : ""
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 md:mb-3">
                  Alamat
                </label>
                <Textarea
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows={3}
                  className={`text-sm md:text-base ${
                    !isEditing ? "bg-gray-50" : ""
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 md:mb-3">
                    Nomor Rumah
                  </label>
                  <Input
                    type="text"
                    name="nomor_rumah"
                    value={formData.nomor_rumah}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`text-sm md:text-base ${
                      !isEditing ? "bg-gray-50" : ""
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 md:mb-3">
                    Nomor HP
                  </label>
                  <Input
                    type="tel"
                    name="nomor_hp"
                    value={formData.nomor_hp}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`text-sm md:text-base ${
                      !isEditing ? "bg-gray-50" : ""
                    }`}
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex flex-col sm:flex-row gap-3 mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200">
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 shadow-lg text-sm md:text-base">
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="secondary"
                  className="w-full sm:w-auto text-sm md:text-base">
                  <X className="w-4 h-4 mr-2" /> Batal
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="pb-4 px-4 md:px-6">
            <CardTitle className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Informasi Akun
            </CardTitle>
            <CardDescription className="text-sm md:text-base text-gray-600">
              Detail informasi akun dan status keanggotaan
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            <div className="space-y-3 md:space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 md:p-4 bg-gray-50 rounded-lg">
                <span className="text-sm md:text-base text-gray-700 font-medium">
                  Status Akun:
                </span>
                <Badge
                  variant={authState.user?.is_admin ? "secondary" : "outline"}
                  className={`flex items-center gap-1 px-2 py-1 text-xs w-fit ${
                    authState.user?.is_admin
                      ? "bg-purple-100 text-purple-800 border-purple-200"
                      : "bg-blue-100 text-blue-800 border-blue-200"
                  }`}>
                  {authState.user?.is_admin ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <Home className="w-3 h-3" />
                  )}
                  {authState.user?.is_admin ? "Administrator" : "Warga"}
                </Badge>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 md:p-4 bg-gray-50 rounded-lg">
                <span className="text-sm md:text-base text-gray-700 font-medium">
                  Bergabung:
                </span>
                <span className="text-sm md:text-base text-gray-900 font-medium">
                  {new Date(
                    authState.user?.created_at || ""
                  ).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
