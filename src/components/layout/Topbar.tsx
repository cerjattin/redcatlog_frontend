import { Bell, LogOut, Menu, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { paths } from "@/routes/paths";
import { useAuthStore } from "@/store/auth.store";

type TopbarProps = {
  onMenuClick: () => void;
};

function getInitials(firstName?: string, lastName?: string): string {
  const first = firstName?.charAt(0) ?? "";
  const last = lastName?.charAt(0) ?? "";

  return `${first}${last}`.toUpperCase() || "RM";
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  async function handleLogout() {
    await logout();

    navigate(paths.public.login, {
      replace: true,
    });
  }

  return (
    <header className="sticky top-0 z-30 border-b border-ink-100 bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          className="inline-flex rounded-xl p-2 text-ink-500 hover:bg-ink-50 lg:hidden"
          aria-label="Abrir menú"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden w-full max-w-md items-center gap-2 rounded-xl border border-ink-100 bg-ink-50 px-3 py-2 md:flex">
          <Search className="h-4 w-4 text-ink-300" />

          <input
            type="search"
            placeholder="Buscar..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-ink-300"
          />
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button
            type="button"
            className="rounded-xl border border-ink-100 p-2 text-ink-500 hover:bg-ink-50"
            aria-label="Notificaciones"
          >
            <Bell className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3 rounded-xl border border-ink-100 px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
              {getInitials(user?.firstName, user?.lastName)}
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-ink-900">
                {user ? `${user.firstName} ${user.lastName}` : "Sin sesión"}
              </p>

              <p className="text-xs capitalize text-ink-500">
                {user?.role ?? "Invitado"}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="hidden rounded-xl border border-ink-100 p-2 text-ink-500 hover:bg-ink-50 sm:inline-flex"
            aria-label="Cerrar sesión"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
