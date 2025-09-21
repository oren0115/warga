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
import { Pencil, X, Save, User as UserIcon, Building2, LogOut, Camera, CheckCircle, Home } from "lucide-react";

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
      <div className="sticky top-0 z-10 bg-gradient-to-r from-green-600 to-green-700 text-white relative overflow-hidden mb-6">
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
              <p className="text-green-100 text-sm">Sistem Pembayaran Digital</p>
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
              className="text-white hover:bg-white/20">
              <LogOut className="w-5 h-5" />
            </Button>
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
          <CardContent className="p-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <UserIcon className="w-10 h-10 text-white" />
                </div>
                <Button
                  size="icon"
                  className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-600 hover:bg-green-700 rounded-full shadow-lg">
                  <Camera className="w-4 h-4 text-white" />
                </Button>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {authState.user?.nama}
                  </h2>
                  <Badge
                    variant={authState.user?.is_admin ? "secondary" : "outline"}
                    className={`flex items-center gap-1 px-3 py-1 ${
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
                <p className="text-gray-600 mb-1">
                  Bergabung:{" "}
                  {new Date(authState.user?.created_at || "").toLocaleDateString(
                    "id-ID",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
                <p className="text-sm text-gray-500">
                  Username: {authState.user?.username}
                </p>
              </div>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "secondary" : "default"}
                className={isEditing ? "" : "bg-green-600 hover:bg-green-700"}>
                {isEditing ? (
                  <>
                    <X className="w-4 h-4 mr-2" /> Batal
                  </>
                ) : (
                  <>
                    <Pencil className="w-4 h-4 mr-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-blue-600" />
              Informasi Pribadi
            </CardTitle>
            <CardDescription className="text-gray-600">
              Ubah detail profil Anda sesuai kebutuhan
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Username
                </label>
                <Input
                  type="text"
                  value={authState.user?.username || ""}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Username tidak dapat diubah
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Nama Lengkap
                </label>
                <Input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50" : ""}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Alamat
                </label>
                <Textarea
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows={3}
                  className={!isEditing ? "bg-gray-50" : ""}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Nomor Rumah
                  </label>
                  <Input
                    type="text"
                    name="nomor_rumah"
                    value={formData.nomor_rumah}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Nomor HP
                  </label>
                  <Input
                    type="tel"
                    name="nomor_hp"
                    value={formData.nomor_hp}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex space-x-3 mt-8 pt-6 border-t border-gray-200">
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700 shadow-lg">
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
                <Button onClick={handleCancel} variant="secondary">
                  <X className="w-4 h-4 mr-2" /> Batal
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Informasi Akun
            </CardTitle>
            <CardDescription className="text-gray-600">
              Detail informasi akun dan status keanggotaan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium">Status Akun:</span>
                <Badge
                  variant={authState.user?.is_admin ? "secondary" : "outline"}
                  className={`flex items-center gap-1 px-3 py-1 ${
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
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium">Bergabung:</span>
                <span className="text-gray-900 font-medium">
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
