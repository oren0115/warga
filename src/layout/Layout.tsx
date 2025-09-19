import React, { useState } from "react";
import { useAuth } from "../context/auth.context";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LuHouse,
  LuReceipt,
  LuHistory,
  LuBell,
  LuUser,
  LuStar,
  LuLogOut,
  LuMenu,
} from "react-icons/lu";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import BottomNav from "../components/common/buttom.navigasi";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { authState, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  const userNavItems = [
    { path: "/", label: "Home", icon: LuHouse },
    { path: "/iuran", label: "Iuran", icon: LuReceipt },
    { path: "/payments", label: "Riwayat", icon: LuHistory },
    { path: "/notifications", label: "Notifikasi", icon: LuBell },
    { path: "/profile", label: "Profil", icon: LuUser },
  ];

  const adminNavItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: LuStar },
    { path: "/admin/users", label: "Pengguna", icon: LuUser },
    { path: "/admin/fees", label: "Generate Iuran", icon: LuReceipt },
    { path: "/admin/payments", label: "Review Pembayaran", icon: LuHistory },
  ];

  const navItems = authState.user?.is_admin ? adminNavItems : userNavItems;

  return (
    <div className="min-h-screen bg-main-background">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-semibold text-main-dark">
            {authState.user?.is_admin ? "Admin Panel" : "RT/RW Fee Management"}
          </h1>
          <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <LuMenu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-4 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.path}
                      variant={isActive(item.path) ? "secondary" : "ghost"}
                      className={`w-full justify-start space-x-3 ${
                        isActive(item.path)
                          ? "bg-green-100 text-primary-green"
                          : "hover:bg-green-50 hover:text-primary-green"
                      }`}
                      onClick={() => {
                        navigate(item.path);
                        setShowMobileMenu(false);
                      }}>
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Button>
                  );
                })}
                <Button
                  variant="destructive"
                  className="w-full justify-start space-x-3"
                  onClick={handleLogout}>
                  <LuLogOut className="h-5 w-5" />
                  <span>Logout</span>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-white lg:border-r">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center px-4">
            <h1 className="text-xl font-bold text-main-dark">
              {authState.user?.is_admin ? "Admin Panel" : "RT/RW Fee"}
            </h1>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.path}
                  variant={isActive(item.path) ? "secondary" : "ghost"}
                  className={`w-full justify-start space-x-3 ${
                    isActive(item.path)
                      ? "bg-green-100 text-primary-green"
                      : "hover:bg-green-50 hover:text-primary-green"
                  }`}
                  onClick={() => navigate(item.path)}>
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </nav>
        </div>
        <div className="flex-shrink-0 border-t p-4 flex items-center">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>
              {authState.user?.nama?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">
              {authState.user?.nama}
            </p>
            <p className="text-xs text-gray-500">
              {authState.user?.is_admin ? "Admin" : "User"}
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="icon"
            className="ml-auto">
            <LuLogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        <main className="min-h-screen">{children}</main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden">
        <BottomNav />
      </div>

      {/* Add bottom padding for mobile bottom nav */}
      <div className="lg:hidden h-16"></div>
    </div>
  );
};

export default Layout;
