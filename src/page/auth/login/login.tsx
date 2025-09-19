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
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Home className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Selamat Datang</CardTitle>
          <CardDescription>
            Masuk ke akun RT/RW Fee Management Anda
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
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder="Masukkan username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div className="space-y-1 relative">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Masukkan password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-8 text-gray-500 hover:text-gray-700">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
              {authState.isLoading ? "Memproses..." : "Masuk"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center text-sm">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="ml-1 font-medium text-blue-600 hover:underline">
            Daftar di sini
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
