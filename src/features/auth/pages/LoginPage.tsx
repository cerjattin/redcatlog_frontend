import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/login.schema";
import { paths } from "@/routes/paths";
import { useAuthStore } from "@/store/auth.store";
import { getDefaultPrivateRouteByRole } from "@/utils/roles";

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const login = useAuthStore((state) => state.login);
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const status = useAuthStore((state) => state.status);
  const error = useAuthStore((state) => state.error);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  if (accessToken && user) {
    return <Navigate to={getDefaultPrivateRouteByRole(user.role)} replace />;
  }

  async function onSubmit(values: LoginFormValues) {
    await login(values);

    const currentUser = useAuthStore.getState().user;
    const currentToken = useAuthStore.getState().accessToken;

    if (!currentUser || !currentToken) {
      return;
    }

    navigate(getDefaultPrivateRouteByRole(currentUser.role), {
      replace: true,
    });
  }

  return (
    <main className="min-h-screen bg-ink-50 px-4 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden lg:block">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary-600">
            Red Mujeres
          </p>

          <h1 className="mt-4 max-w-xl text-5xl font-bold leading-tight text-ink-900">
            Plataforma privada para gestionar historias, productos y
            emprendimientos.
          </h1>

          <p className="mt-5 max-w-lg text-base leading-7 text-ink-500">
            Ingresa al panel Beta para administrar perfiles, catálogos,
            aprobaciones e información de emprendedoras.
          </p>

          <div className="mt-8 grid max-w-xl gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <strong className="block text-2xl text-ink-900">Beta</strong>
              <span className="mt-1 block text-sm text-ink-500">
                Versión inicial
              </span>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <strong className="block text-2xl text-ink-900">JWT</strong>
              <span className="mt-1 block text-sm text-ink-500">
                Sesión segura
              </span>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <strong className="block text-2xl text-ink-900">Roles</strong>
              <span className="mt-1 block text-sm text-ink-500">
                Admin y emprendedora
              </span>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md rounded-3xl border border-ink-100 bg-white p-6 shadow-sm sm:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary-600">
              Bienvenido
            </p>

            <h2 className="mt-3 text-2xl font-bold text-ink-900">
              Iniciar sesión
            </h2>

            <p className="mt-2 text-sm leading-6 text-ink-500">
              Accede con tu correo y contraseña registrados en Red Mujeres.
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Correo electrónico"
              type="email"
              autoComplete="email"
              placeholder="correo@ejemplo.com"
              error={errors.email?.message}
              {...register("email")}
            />

            <div>
              <div className="relative">
                <Input
                  label="Contraseña"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  error={errors.password?.message}
                  {...register("password")}
                />

                <button
                  type="button"
                  className="absolute right-3 top-9 rounded-lg p-1 text-ink-400 hover:bg-ink-50 hover:text-ink-700"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error ? (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            ) : null}
            <Link
              to={paths.auth.forgotPassword}
              className="text-sm font-semibold text-primary-600 hover:text-primary-700"
            >
              ¿Olvidaste tu contraseña?
            </Link>
            <Button
              type="submit"
              className="w-full"
              isLoading={status === "loading"}
            >
              Ingresar
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500">
            ¿Aún no tienes cuenta?{" "}
            <Link
              to={paths.public.register}
              className="font-semibold text-primary-600 hover:text-primary-700"
            >
              Registrar emprendedora
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
