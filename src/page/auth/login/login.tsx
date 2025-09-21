import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../context/auth.context";
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
import { Loader2, Eye, EyeOff, Home } from "lucide-react";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, authState } = useAuth();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.username || !formData.password) {
      setError("Username dan password harus diisi");
      return;
    }

    try {
      await login(formData.username, formData.password);
      navigate("/");
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          "Login gagal. Periksa kembali username dan password."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl border border-gray-100">
        <CardHeader className="text-center space-y-2">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-sm">
            <Home className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-3xl font-extrabold text-gray-800">
            Selamat Datang
          </CardTitle>
          <CardDescription className="text-gray-500 text-sm">
            Masuk ke akun <span className="font-medium">RT/RW Fee Management</span>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <Alert variant="destructive" className="text-sm">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder="contoh: budi123"
                value={formData.username}
                onChange={handleChange}
                className="rounded-xl focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            {/* Password */}
            <div className="space-y-2 relative">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Minimal 6 karakter"
                value={formData.password}
                onChange={handleChange}
                className="rounded-xl focus:ring-2 focus:ring-blue-500 transition pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full rounded-xl py-2 text-base font-medium shadow-md hover:shadow-lg transition"
              disabled={authState.isLoading}>
              {authState.isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {authState.isLoading ? "Memproses..." : "Masuk Sekarang"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center text-sm text-gray-600">
          Belum punya akun?
          <Link
            to="/register"
            className="ml-1 font-semibold text-blue-600 hover:underline">
            Daftar di sini
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
