import {
  LayoutDashboard,
  Cpu,
  Package,
  MapPin,
  Route,
  Wrench,
  FileText,
  Settings,
  Activity,
  Building2,
} from "lucide-react";

export const sidebarSections = [
  {
    title: "General",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Centros", href: "/centers", icon: Building2 },
      { label: "POSs", href: "/pos", icon: MapPin },
      { label: "Máquinas", href: "/machines", icon: Cpu },
      { label: "Productos", href: "/products", icon: Package },
    ],
  },
  {
    title: "Operaciones",
    items: [
      { label: "Rutas", href: "/routes", icon: Route },
      { label: "Mantenimiento", href: "/maintenance", icon: Wrench },
    ],
  },
  {
    title: "Administración",
    items: [
      { label: "Facturación", href: "/invoices", icon: FileText },
      { label: "Actividad", href: "/activity", icon: Activity },
      { label: "Configuración", href: "/settings", icon: Settings },
    ],
  },
];
