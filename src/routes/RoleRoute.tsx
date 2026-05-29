import { Navigate, Outlet } from "react-router-dom";

import { Loader } from "@/components/feedback/Loader";
import { paths } from "@/routes/paths";
import { useAuthStore } from "@/store/auth.store";
import type { UserRole } from "@/types/user.types";

type RoleRouteProps = {
  allowedRoles: UserRole[];
};

export function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);

  if (status === "loading") {
    return <Loader label="Verificando permisos..." />;
  }

  if (!user) {
    return <Navigate to={paths.public.login} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={paths.public.unauthorized} replace />;
  }

  return <Outlet />;
}
