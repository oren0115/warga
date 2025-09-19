import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Home,
  CreditCard,
  History,
  User,
  LayoutDashboard,
  Users,
  FilePlus2,
  CheckSquare,
} from "lucide-react";
import { useAuth } from "../../context/auth.context";

const BottomNav: React.FC = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = authState.user?.is_admin;

  const isActive = (path: string) => location.pathname === path;

  const userNavItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/iuran", label: "Iuran", icon: CreditCard },
    { path: "/payment-history", label: "History", icon: History },
    { path: "/profile", label: "Profil", icon: User },
  ];

  const adminNavItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/users", label: "Users", icon: Users },
    { path: "/admin/fees", label: "Generate", icon: FilePlus2 },
    { path: "/admin/payments", label: "Review", icon: CheckSquare },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <nav className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.path}
              variant="ghost"
              className={`flex flex-col items-center py-2 px-1 min-w-0 flex-1 h-16 transition-colors ${
                isActive(item.path)
                  ? "text-primary-green bg-green-50"
                  : "text-gray-500 hover:text-primary-green hover:bg-green-50"
              }`}
              onClick={() => navigate(item.path)}>
              <Icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </Button>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNav;
