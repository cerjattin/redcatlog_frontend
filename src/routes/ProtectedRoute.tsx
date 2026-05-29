import { Navigate, Outlet, useLocation } from "react-router-dom";

import { Loader } from "@/components/feedback/Loader";
import { paths } from "@/routes/paths";
import { useAuthStore } from "@/store/auth.store";

export function ProtectedRoute() {
  const location = useLocation();

  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);

  if (status === "loading") {
    return <Loader label="Validando sesión..." />;
  }

  if (!accessToken || !user) {
    return <Navigate to={paths.public.login} replace />;
  }

  if (
    user.forcePasswordChange === true &&
    location.pathname !== paths.auth.changePassword
  ) {
    return <Navigate to={paths.auth.changePassword} replace />;
  }

  return <Outlet />;
}
