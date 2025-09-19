import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../context/auth.context";
import type { RegisterRequest } from "../../../types";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { Loader2, Eye, EyeOff, UserPlus } from "lucide-react";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, authState } = useAuth();

  const [formData, setFormData] = useState<RegisterRequest>({
    username: "",
    nama: "",
    alamat: "",
    nomor_rumah: "",
    nomor_hp: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !formData.username ||
      !formData.nama ||
      !formData.alamat ||
      !formData.nomor_rumah ||
      !formData.nomor_hp ||
      !formData.password
    ) {
      setError("Semua field harus diisi");
      return;
    }

    if (formData.password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak sama");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    try {
      await register(formData);
      navigate("/");
    } catch (err: any) {
      setError(
        err.response?.data?.detail || "Registrasi gagal. Silakan coba lagi."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <UserPlus className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Daftar Akun Baru</CardTitle>
          <CardDescription>
            Buat akun untuk mengakses RT/RW Fee Management
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Username */}
            <div className="space-y-1">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Masukkan username"
              />
            </div>

            {/* Nama */}
            <div className="space-y-1">
              <Label htmlFor="nama">Nama Lengkap *</Label>
              <Input
                id="nama"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap"
              />
            </div>

            {/* Alamat */}
            <div className="space-y-1">
              <Label htmlFor="alamat">Alamat *</Label>
              <Input
                id="alamat"
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                placeholder="Masukkan alamat lengkap"
              />
            </div>

            {/* Nomor rumah & Nomor HP */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="nomor_rumah">No. Rumah *</Label>
                <Input
                  id="nomor_rumah"
                  name="nomor_rumah"
                  value={formData.nomor_rumah}
                  onChange={handleChange}
                  placeholder="No. Rumah"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="nomor_hp">No. HP *</Label>
                <Input
                  id="nomor_hp"
                  name="nomor_hp"
                  type="tel"
                  value={formData.nomor_hp}
                  onChange={handleChange}
                  placeholder="No. HP"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1 relative">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimal 6 karakter"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-8 text-gray-500 hover:text-gray-700">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1 relative">
              <Label htmlFor="confirmPassword">Konfirmasi Password *</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute right-3 top-8 text-gray-500 hover:text-gray-700">
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              disabled={authState.isLoading}>
              {authState.isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {authState.isLoading ? "Mendaftar..." : "Daftar"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center text-sm">
          Sudah punya akun?
          <Link
            to="/login"
            className="ml-1 font-medium text-blue-600 hover:underline">
            Masuk di sini
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
