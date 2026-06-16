import {
  Briefcase,
  LayoutDashboard,
  Settings,
  Users,
  Search,
  PlusCircle,
  FileText,
  ShieldAlert,
} from 'lucide-react';
import type { Role } from '../../../context/AuthContext';
import type { ReactNode, ElementType } from 'react';

// ------------------------------------------------------------------
// 1. ESTRATEGIA (Strategy Dictionary)
// ------------------------------------------------------------------
export interface SidebarItemConfig {
  name: string;
  href: string;
  icon: ElementType<{ className?: string }>;
}

const STRATEGY_NAVIGATION: Record<Role, SidebarItemConfig[]> = {
  freelancer: [
    { name: 'Mi Feed', href: '/freelancer', icon: Search },
    { name: 'Mis Postulaciones', href: '/freelancer/postulaciones', icon: Briefcase },
    { name: 'Mis Trabajos', href: '/freelancer/trabajos', icon: FileText },
    { name: 'Configuración', href: '/freelancer/settings', icon: Settings },
  ],
  empresa: [
    { name: 'Mis Proyectos', href: '/empresa', icon: LayoutDashboard },
    { name: 'Publicar Oferta', href: '/empresa/crear', icon: PlusCircle },
    { name: 'Talento Guardado', href: '/empresa/talento', icon: Users },
    { name: 'Configuración', href: '/empresa/settings', icon: Settings },
  ],
  admin: [
    { name: 'Visión Global', href: '/admin', icon: LayoutDashboard },
    { name: 'Curaduría de Proyectos', href: '/admin/proyectos', icon: FileText },
    { name: 'Gestión de Usuarios', href: '/admin/usuarios', icon: Users },
    { name: 'Reportes y Alertas', href: '/admin/alertas', icon: ShieldAlert },
  ],
};

// ------------------------------------------------------------------
// 2. FÁBRICA (The Factory)
// ------------------------------------------------------------------
export class DashboardFactory {
  /**
   * Obtiene la configuración pura de la barra lateral según el rol
   */
  static getSidebarConfig(role: Role): SidebarItemConfig[] {
    return STRATEGY_NAVIGATION[role] || [];
  }

  /**
   * Construye los elementos de la barra lateral dinámicamente
   * (En este caso retorna la data para que React la dibuje, o podría devolver JSX)
   */
  static buildSidebarNavigation(role: Role): ReactNode[] {
    const items = this.getSidebarConfig(role);
    // Return objects or JSX. We return raw data to let the React Component handle the render cleanly.
    return items.map(item => item) as any;
  }
}
