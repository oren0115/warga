import React, { useState, useEffect } from "react";
import { adminService } from "../../services/admin.service";
import { useAuth } from "../../context/auth.context";
import type { User } from "../../types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../ui/select";
import {
  X,
  Save,
  UserPlus,
  Edit,
  Shield,
  ShieldOff,
  Eye,
  EyeOff,
  AlertTriangle,
} from "lucide-react";

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated: () => void;
  user?: User | null;
  mode: "create" | "edit" | "view";
}

const UserManagementModal: React.FC<UserManagementModalProps> = ({
  isOpen,
  onClose,
  onUserUpdated,
  user,
  mode,
}) => {
  const { authState } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    nama: "",
    alamat: "",
    nomor_rumah: "",
    nomor_hp: "",
    password: "",
    is_admin: false,
    tipe_rumah: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Admin validation
  const isAdmin = authState.user?.is_admin === true;

  useEffect(() => {
    if (user && (mode === "edit" || mode === "view")) {
      setFormData({
        username: user.username,
        nama: user.nama,
        alamat: user.alamat,
        nomor_rumah: user.nomor_rumah,
        nomor_hp: user.nomor_hp,
        password: "",
        is_admin: user.is_admin,
        tipe_rumah: user.tipe_rumah || "",
      });
    } else if (mode === "create") {
      setFormData({
        username: "",
        nama: "",
        alamat: "",
        nomor_rumah: "",
        nomor_hp: "",
        password: "",
        is_admin: false,
        tipe_rumah: "",
      });
    }
    setErrors({});
    setShowDeleteConfirm(false);
  }, [user, mode, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username wajib diisi";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username minimal 3 karakter";
    }

    if (!formData.nama.trim()) {
      newErrors.nama = "Nama wajib diisi";
    }

    if (!formData.alamat.trim()) {
      newErrors.alamat = "Alamat wajib diisi";
    }

    if (!formData.nomor_rumah.trim()) {
      newErrors.nomor_rumah = "Nomor rumah wajib diisi";
    }

    if (!formData.nomor_hp.trim()) {
      newErrors.nomor_hp = "Nomor HP wajib diisi";
    } else if (!/^[0-9+\-\s()]+$/.test(formData.nomor_hp)) {
      newErrors.nomor_hp = "Format nomor HP tidak valid";
    }

    if (mode === "create" && !formData.password.trim()) {
      newErrors.password = "Password wajib diisi";
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }

    if (!formData.tipe_rumah.trim()) {
      newErrors.tipe_rumah = "Tipe rumah wajib dipilih";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Admin validation untuk create dan edit
    if (!isAdmin && (mode === "create" || mode === "edit")) {
      setErrors({
        general:
          "Akses ditolak. Hanya administrator yang dapat menambah atau mengedit pengguna.",
      });
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (mode === "create") {
        await adminService.createUser(formData);
      } else if (mode === "edit" && user) {
        const updateData = { ...formData };
        if (!updateData.password) {
          delete (updateData as any).password;
        }
        await adminService.updateUser(user.id, updateData);
      }

      onUserUpdated();
      onClose();
    } catch (error: any) {
      console.error("Error saving user:", error);
      const errorMessage =
        error.response?.data?.detail || "Terjadi kesalahan saat menyimpan data";
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;

    // Admin validation untuk delete
    if (!isAdmin) {
      setErrors({
        general:
          "Akses ditolak. Hanya administrator yang dapat menghapus pengguna.",
      });
      return;
    }

    setIsLoading(true);
    try {
      await adminService.deleteUser(user.id);
      onUserUpdated();
      onClose();
    } catch (error: any) {
      console.error("Error deleting user:", error);
      setErrors({ general: "Terjadi kesalahan saat menghapus pengguna" });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const isReadOnly = mode === "view";
  const isCreate = mode === "create";
  const isEdit = mode === "edit";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto ">
        <CardHeader className="border-b ">
          <div className="flex items-center justify-between ">
            <div className="flex items-center space-x-3">
              {isCreate && <UserPlus className="w-6 h-6 text-green-600" />}
              {isEdit && <Edit className="w-6 h-6 text-green-600" />}
              {isReadOnly && <Eye className="w-6 h-6 text-gray-600" />}
              <CardTitle className="text-xl ">
                {isCreate && "Tambah Pengguna Baru"}
                {isEdit && "Edit Data Pengguna"}
                {isReadOnly && "Detail Pengguna"}
              </CardTitle>
            </div>
            <Button
              // variant="outline"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 bg-green-600 text-white hover:bg-green-700 ">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {!isAdmin && (mode === "create" || mode === "edit") && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <p className="text-sm text-yellow-700">
                  <strong>Peringatan:</strong> Hanya administrator yang dapat
                  menambah atau mengedit pengguna. Anda hanya dapat melihat data
                  dalam mode read-only.
                </p>
              </div>
            </div>
          )}

          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <p className="text-sm text-red-700">{errors.general}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Info Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Informasi Pengguna
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    disabled={
                      isReadOnly ||
                      (!isAdmin && (mode === "create" || mode === "edit"))
                    }
                    className={errors.username ? "border-red-300" : ""}
                    placeholder="Masukkan username"
                  />
                  {errors.username && (
                    <p className="text-sm text-red-600">{errors.username}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nama">Nama Lengkap *</Label>
                  <Input
                    id="nama"
                    value={formData.nama}
                    onChange={(e) =>
                      setFormData({ ...formData, nama: e.target.value })
                    }
                    disabled={
                      isReadOnly ||
                      (!isAdmin && (mode === "create" || mode === "edit"))
                    }
                    className={errors.nama ? "border-red-300" : ""}
                    placeholder="Masukkan nama lengkap"
                  />
                  {errors.nama && (
                    <p className="text-sm text-red-600">{errors.nama}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alamat">Alamat *</Label>
                <Input
                  id="alamat"
                  value={formData.alamat}
                  onChange={(e) =>
                    setFormData({ ...formData, alamat: e.target.value })
                  }
                  disabled={
                    isReadOnly ||
                    (!isAdmin && (mode === "create" || mode === "edit"))
                  }
                  className={errors.alamat ? "border-red-300" : ""}
                  placeholder="Masukkan alamat lengkap"
                />
                {errors.alamat && (
                  <p className="text-sm text-red-600">{errors.alamat}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nomor_rumah">Nomor Rumah *</Label>
                  <Input
                    id="nomor_rumah"
                    value={formData.nomor_rumah}
                    onChange={(e) =>
                      setFormData({ ...formData, nomor_rumah: e.target.value })
                    }
                    disabled={
                      isReadOnly ||
                      (!isAdmin && (mode === "create" || mode === "edit"))
                    }
                    className={errors.nomor_rumah ? "border-red-300" : ""}
                    placeholder="Contoh: 15A"
                  />
                  {errors.nomor_rumah && (
                    <p className="text-sm text-red-600">{errors.nomor_rumah}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nomor_hp">Nomor HP *</Label>
                  <Input
                    id="nomor_hp"
                    value={formData.nomor_hp}
                    onChange={(e) =>
                      setFormData({ ...formData, nomor_hp: e.target.value })
                    }
                    disabled={
                      isReadOnly ||
                      (!isAdmin && (mode === "create" || mode === "edit"))
                    }
                    className={errors.nomor_hp ? "border-red-300" : ""}
                    placeholder="Contoh: 081234567890"
                  />
                  {errors.nomor_hp && (
                    <p className="text-sm text-red-600">{errors.nomor_hp}</p>
                  )}
                </div>
              </div>

              {/* Tipe Rumah */}
              <div className="space-y-2">
                <Label htmlFor="tipe_rumah">Tipe Rumah</Label>
                <Select
                  value={formData.tipe_rumah}
                  onValueChange={(value) =>
                    setFormData({ ...formData, tipe_rumah: value })
                  }
                  disabled={
                    isReadOnly ||
                    (!isAdmin && (mode === "create" || mode === "edit"))
                  }>
                  <SelectTrigger id="tipe_rumah">
                    <SelectValue placeholder="Pilih tipe rumah" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="60M2">60M²</SelectItem>
                    <SelectItem value="72M2">72M²</SelectItem>
                    <SelectItem value="HOOK">Hook</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Tipe rumah menentukan tarif IPL yang akan dikenakan
                </p>
                {errors.tipe_rumah && (
                  <p className="text-sm text-red-600">{errors.tipe_rumah}</p>
                )}
              </div>

              {(isCreate || (isEdit && formData.password)) && (
                <div className="space-y-2">
                  <Label htmlFor="password">
                    Password {isCreate ? "*" : "(kosongkan jika tidak diubah)"}
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      disabled={
                        isReadOnly ||
                        (!isAdmin && (mode === "create" || mode === "edit"))
                      }
                      className={
                        errors.password ? "border-red-300 pr-10" : "pr-10"
                      }
                      placeholder="Masukkan password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600">{errors.password}</p>
                  )}
                </div>
              )}
            </div>

            {/* Role Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Role & Akses
              </h3>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {formData.is_admin ? (
                    <Shield className="w-5 h-5 text-purple-600" />
                  ) : (
                    <ShieldOff className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">
                      {formData.is_admin ? "Administrator" : "Warga Biasa"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formData.is_admin
                        ? "Memiliki akses penuh ke sistem admin"
                        : "Akses terbatas sebagai warga"}
                    </p>
                  </div>
                </div>

                {!isReadOnly && isAdmin && (
                  <div className="flex items-center space-x-2">
                    <Badge
                      className={`px-3 py-1 ${
                        formData.is_admin
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                      {formData.is_admin ? "Admin" : "Warga"}
                    </Badge>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          is_admin: !formData.is_admin,
                        })
                      }
                      className="text-xs">
                      {formData.is_admin ? "Jadikan Warga" : "Jadikan Admin"}
                    </Button>
                  </div>
                )}
                {!isReadOnly && !isAdmin && (
                  <div className="flex items-center space-x-2">
                    <Badge
                      className={`px-3 py-1 ${
                        formData.is_admin
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                      {formData.is_admin ? "Admin" : "Warga"}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      Hanya admin yang dapat mengubah role
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t">
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  className=" hover:bg-red-700"
                  onClick={onClose}
                  disabled={isLoading}>
                  Batal
                </Button>
                {!isReadOnly && isAdmin && (
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700">
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? "Menyimpan..." : "Simpan"}
                  </Button>
                )}
                {!isReadOnly && !isAdmin && (
                  <div className="text-xs text-gray-500 px-3 py-2">
                    Hanya admin yang dapat menyimpan perubahan
                  </div>
                )}
              </div>
            </div>
          </form>

          {/* Delete Confirmation */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-60">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle className="text-red-600 flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span>Konfirmasi Hapus</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Apakah Anda yakin ingin menghapus pengguna{" "}
                    <span className="font-semibold">{user?.nama}</span>?
                    Tindakan ini tidak dapat dibatalkan.
                  </p>
                  <div className="flex space-x-2 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={isLoading}>
                      Batal
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={isLoading}>
                      {isLoading ? "Menghapus..." : "Hapus"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagementModal;
