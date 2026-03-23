
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Map, 
  Send, 
  User,
  Menu,
  X,
  Briefcase,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar = ({ open, setOpen }: SidebarProps) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "User Details", href: "/user-details", icon: Users },
    { name: "Service Requests", href: "/service-requests", icon: FileText },
    { name: "Competitors", href: "/competitors", icon: Map },
    { name: "Telegram Bot", href: "/telegram-bot", icon: Send },
    { name: "Profile", href: "/profile", icon: User },
  ];
  
  const handleLogout = () => {
    logout();
  };

  return (
    <div className={cn(
      "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r shadow-sm transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
      !open && "-translate-x-full"
    )}>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-fleet-blue">RESQTRACK</span>
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg md:hidden hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-x-3 px-3 py-2 text-sm font-medium rounded-md",
                  location.pathname === item.href
                    ? "bg-fleet-blue text-white"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="border-t p-4">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-fleet-blue flex items-center justify-center text-white">
                <span className="text-sm font-medium">
                  {user?.name ? user.name.substring(0, 2).toUpperCase() : "SF"}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium">{user?.name || "N?A"}</p>
                <p className="text-xs text-gray-500">{user?.email || "N/A"}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-gray-700 w-full px-3 py-2 rounded-md hover:bg-gray-100"
            >
              <LogOut size={18} />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
