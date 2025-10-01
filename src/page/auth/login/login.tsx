import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/auth.context";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { Loader2, Eye, EyeOff, User, Lock } from "lucide-react";

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

      // Get user info from localStorage after successful login
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo) {
        const user = JSON.parse(userInfo);
        // Redirect based on user role
        if (user.is_admin) {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } else {
        navigate("/");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          "Login gagal. Periksa kembali username dan password."
      );
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-muted/30"
      style={{
        backgroundImage: "url('/bg-login.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
      <Card className="w-full max-w-sm md:max-w-md shadow-2xl rounded-2xl border border-gray-200/50 bg-white/60 backdrop-blur-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl md:text-3xl font-extrabold text-gray-800">
            Selamat Datang
          </CardTitle>
          <CardDescription className="text-gray-500 text-sm">
            Masuk ke akun{" "}
            <span className="font-semibold">IPL Cluster Cannary</span>
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
            <div className="space-y-2 relative">
              <Label
                htmlFor="username"
                className="text-sm font-medium text-gray-700">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder="username..."
                value={formData.username}
                onChange={handleChange}
                className="rounded-xl pl-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition"
              />
              <User className="absolute left-3 top-9 w-4 h-4 text-gray-400" />
            </div>

            {/* Password */}
            <div className="space-y-2 relative">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700">
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
                className="rounded-xl pl-10 pr-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition"
              />
              <Lock className="absolute left-3 top-9 w-4 h-4 text-gray-400" />
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
              className="w-full rounded-xl py-2 text-base font-semibold shadow-md hover:shadow-lg transition bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 cursor-pointer"
              disabled={authState.isLoading}>
              {authState.isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {authState.isLoading ? "Memproses..." : "Masuk Sekarang"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
