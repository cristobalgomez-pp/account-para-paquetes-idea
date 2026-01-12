import { Link, useLocation } from "react-router-dom";
import { 
  Package, 
  User, 
  FileText, 
  Heart, 
  RefreshCw, 
  BarChart3,
  Headphones,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Inicio", icon: Home, path: "/" },
  { title: "Órdenes", icon: Package, path: "/orders" },
  { title: "Mi Cuenta", icon: User, path: "/account" },
  { title: "Facturación", icon: FileText, path: "/billing" },
  { title: "Favoritos", icon: Heart, path: "/favorites" },
  { title: "Suscripciones", icon: RefreshCw, path: "/subscriptions" },
  { title: "Soporte", icon: Headphones, path: "/support" },
  { title: "Analytics", icon: BarChart3, path: "/analytics" },
];

const AccountNav = () => {
  const location = useLocation();

  return (
    <nav className="w-full border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default AccountNav;
