import { 
  Package, 
  User, 
  FileText, 
  Heart, 
  RefreshCw, 
  BarChart3,
  Headphones
} from "lucide-react";
import AccountCard from "./AccountCard";

const accountOptions = [
  {
    title: "Órdenes",
    description: "Revisa el historial y estado de tus pedidos",
    icon: Package,
    iconBgClass: "bg-orders",
    path: "/orders",
  },
  {
    title: "Mi Cuenta",
    description: "Gestiona tu información personal y preferencias",
    icon: User,
    iconBgClass: "bg-account",
    path: "/account",
  },
  {
    title: "Facturación",
    description: "Administra métodos de pago y facturas",
    icon: FileText,
    iconBgClass: "bg-billing",
    path: "/billing",
  },
  {
    title: "Favoritos",
    description: "Tus productos guardados y listas de deseos",
    icon: Heart,
    iconBgClass: "bg-favorites",
    path: "/favorites",
  },
  {
    title: "Suscripciones",
    description: "Gestiona tus planes y renovaciones",
    icon: RefreshCw,
    iconBgClass: "bg-subscriptions",
    path: "/subscriptions",
  },
  {
    title: "Soporte",
    description: "Consulta y gestiona tus tickets de ayuda",
    icon: Headphones,
    iconBgClass: "bg-support",
    path: "/support",
  },
  {
    title: "Analytics",
    description: "Estadísticas de compras y actividad",
    icon: BarChart3,
    iconBgClass: "bg-analytics",
    path: "/analytics",
  },
];

const AccountDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Mi Cuenta
          </h1>
          <p className="text-muted-foreground">
            Bienvenido de vuelta. Gestiona todas tus opciones desde aquí.
          </p>
        </div>

        {/* Grid de opciones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {accountOptions.map((option) => (
            <AccountCard
              key={option.title}
              title={option.title}
              description={option.description}
              icon={option.icon}
              iconBgClass={option.iconBgClass}
              path={option.path}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountDashboard;
