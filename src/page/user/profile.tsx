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
import { Pencil, X, Save, User as UserIcon } from "lucide-react";

const Profile: React.FC = () => {
  const { authState, updateProfile } = useAuth();
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-900">Profil Saya</h1>
          <p className="text-sm text-gray-600">Kelola informasi profil Anda</p>
        </div>
      </div>

      <div className="p-4 space-y-6 max-w-4xl mx-auto">
        {/* Profile Header */}
        <Card>
          <CardContent className="flex items-center space-x-4 py-6">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">
                {authState.user?.nama}
              </h2>
              <p className="text-gray-600">
                {authState.user?.is_admin ? "Administrator" : "Warga"}
              </p>
              <p className="text-sm text-gray-500">
                Bergabung:{" "}
                {new Date(authState.user?.created_at || "").toLocaleDateString(
                  "id-ID"
                )}
              </p>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "secondary" : "default"}>
              {isEditing ? (
                <>
                  <X className="w-4 h-4 mr-2" /> Batal
                </>
              ) : (
                <>
                  <Pencil className="w-4 h-4 mr-2" /> Edit Profil
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Pribadi</CardTitle>
            <CardDescription>Ubah detail profil Anda</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Username
                </label>
                <Input
                  type="text"
                  value={authState.user?.username || ""}
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">
                  Username tidak dapat diubah
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Nama Lengkap
                </label>
                <Input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Alamat</label>
                <Textarea
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nomor Rumah
                  </label>
                  <Input
                    type="text"
                    name="nomor_rumah"
                    value={formData.nomor_rumah}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nomor HP
                  </label>
                  <Input
                    type="tel"
                    name="nomor_hp"
                    value={formData.nomor_hp}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex space-x-3 mt-6">
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

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Akun</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Status Akun:</span>
                <Badge
                  variant={authState.user?.is_admin ? "secondary" : "outline"}
                  className={
                    authState.user?.is_admin
                      ? "bg-purple-100 text-purple-800"
                      : "bg-green-100 text-green-800"
                  }>
                  {authState.user?.is_admin ? "Administrator" : "Warga"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bergabung:</span>
                <span className="text-sm">
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
