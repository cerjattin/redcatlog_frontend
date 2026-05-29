import {
  KeyRound,
  LayoutDashboard,
  Package,
  ShieldCheck,
  Store,
  Tags,
  UserRoundCheck,
  Users,
  X,
} from "lucide-react";
import type { ComponentType } from "react";
import { NavLink } from "react-router-dom";

import { paths } from "@/routes/paths";
import { useAuthStore } from "@/store/auth.store";
import { isAdminRole, isEntrepreneurRole } from "@/utils/roles";

type SidebarProps = {
  isMobileOpen: boolean;
  onMobileClose: () => void;
};

type SidebarLink = {
  label: string;
  href: string;
  icon: ComponentType<{
    className?: string;
  }>;
};

const entrepreneurLinks: SidebarLink[] = [
  {
    label: "Dashboard",
    href: paths.entrepreneur.dashboard,
    icon: LayoutDashboard,
  },
  {
    label: "Mi perfil",
    href: paths.entrepreneur.profile,
    icon: UserRoundCheck,
  },
  {
    label: "Emprendimientos",
    href: paths.entrepreneur.businesses,
    icon: Store,
  },
  {
    label: "Productos",
    href: paths.entrepreneur.products,
    icon: Package,
  },
  {
    label: "Seguridad",
    href: paths.auth.changePassword,
    icon: KeyRound,
  },
];

const adminLinks: SidebarLink[] = [
  {
    label: "Dashboard",
    href: paths.admin.dashboard,
    icon: LayoutDashboard,
  },
  {
    label: "Usuarias",
    href: paths.admin.users,
    icon: Users,
  },
  {
    label: "Emprendedoras",
    href: paths.admin.entrepreneurs,
    icon: UserRoundCheck,
  },
  {
    label: "Emprendimientos",
    href: paths.admin.businesses,
    icon: Store,
  },
  {
    label: "Productos",
    href: paths.admin.products,
    icon: Package,
  },
  {
    label: "Categorías",
    href: paths.admin.categories,
    icon: Tags,
  },
  {
    label: "Aprobaciones",
    href: paths.admin.approvals,
    icon: ShieldCheck,
  },
  {
    label: "Seguridad",
    href: paths.auth.changePassword,
    icon: KeyRound,
  },
];

function getRoleName(role: unknown) {
  if (!role) {
    return null;
  }

  if (typeof role === "string") {
    return role;
  }

  if (typeof role === "object" && "name" in role) {
    const roleName = (role as { name?: unknown }).name;

    return typeof roleName === "string" ? roleName : null;
  }

  return null;
}

function getLinksByRole(role?: string | null) {
  if (isAdminRole(role as never)) {
    return adminLinks;
  }

  if (isEntrepreneurRole(role as never)) {
    return entrepreneurLinks;
  }

  return [];
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const user = useAuthStore((state) => state.user);
  const roleName = getRoleName(user?.role);
  const links = getLinksByRole(roleName);

  return (
    <>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary-600">
          Red Mujeres
        </p>

        <h1 className="mt-2 text-xl font-bold text-ink-900">Panel Beta</h1>

        <p className="mt-1 text-xs text-ink-500">
          Gestión privada de plataforma
        </p>
      </div>

      <nav className="mt-8 space-y-1">
        {links.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={onNavigate}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
                  isActive
                    ? "bg-primary-50 text-primary-700"
                    : "text-ink-500 hover:bg-ink-50 hover:text-ink-900",
                ].join(" ")
              }
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}

export function Sidebar({ isMobileOpen, onMobileClose }: SidebarProps) {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-ink-100 bg-white px-5 py-6 lg:block">
        <SidebarContent />
      </aside>

      {isMobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            className="absolute inset-0 bg-ink-900/40"
            onClick={onMobileClose}
          />

          <aside className="relative h-full w-72 max-w-[85vw] border-r border-ink-100 bg-white px-5 py-6 shadow-xl">
            <div className="mb-6 flex justify-end">
              <button
                type="button"
                aria-label="Cerrar menú"
                className="rounded-xl p-2 text-ink-500 hover:bg-ink-50"
                onClick={onMobileClose}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <SidebarContent onNavigate={onMobileClose} />
          </aside>
        </div>
      ) : null}
    </>
  );
}
