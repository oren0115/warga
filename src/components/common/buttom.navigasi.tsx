import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  CreditCard,
  History,
  User,
  LayoutDashboard,
  Users,
  FilePlus2,
  CheckSquare,
  Bell,
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
    { path: "/payments", label: "Pembayaran", icon: History },
    { path: "/profile", label: "Profil", icon: User },
  ];

  const adminNavItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/users", label: "Users", icon: Users },
    { path: "/admin/fees", label: "Generate", icon: FilePlus2 },
    { path: "/admin/payments", label: "Review", icon: CheckSquare },
    { path: "/admin/broadcast", label: "Broadcast", icon: Bell },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <nav className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center py-3 px-2 min-w-0 flex-1 h-18 transition-all duration-200 ${
                isActive(item.path)
                  ? "text-green-700 bg-green-100 font-semibold"
                  : "text-gray-500 hover:text-green-600 hover:bg-green-50"
              }`}
            >
              <Icon className={`h-6 w-6 ${isActive(item.path) ? 'text-green-700' : ''}`} />
              <span className={`text-sm mt-1 font-medium ${isActive(item.path) ? 'text-green-700' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNav;
