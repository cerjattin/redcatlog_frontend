import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/features/auth/schemas/register.schema";
import { paths } from "@/routes/paths";
import { useAuthStore } from "@/store/auth.store";
import { getDefaultPrivateRouteByRole } from "@/utils/roles";

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const registerUser = useAuthStore((state) => state.register);
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const status = useAuthStore((state) => state.status);
  const error = useAuthStore((state) => state.error);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      whatsapp: "",
      city: "",
      department: "",
    },
  });

  if (accessToken && user) {
    return <Navigate to={getDefaultPrivateRouteByRole(user.role)} replace />;
  }
  async function onSubmit(values: RegisterFormValues) {
    await registerUser(values);

    const currentUser = useAuthStore.getState().user;
    const currentToken = useAuthStore.getState().accessToken;

    if (!currentUser || !currentToken) {
      return;
    }

    setSuccessMessage(
      "Cuenta creada correctamente. Ahora puedes iniciar sesión.",
    );

    await useAuthStore.getState().logout();

    setTimeout(() => {
      navigate(paths.public.login, {
        replace: true,
      });
    }, 1500);
  }

  return (
    <main className="min-h-screen bg-ink-50 px-4 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="hidden lg:block">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary-600">
            Red Mujeres
          </p>

          <h1 className="mt-4 max-w-xl text-5xl font-bold leading-tight text-ink-900">
            Registro de emprendedoras para la vitrina digital.
          </h1>

          <p className="mt-5 max-w-lg text-base leading-7 text-ink-500">
            Crea una cuenta para iniciar el proceso de perfil, emprendimiento,
            productos y aprobación dentro de la plataforma.
          </p>
        </section>

        <section className="mx-auto w-full max-w-2xl rounded-3xl border border-ink-100 bg-white p-6 shadow-sm sm:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary-600">
              Nueva cuenta
            </p>

            <h2 className="mt-3 text-2xl font-bold text-ink-900">
              Registrar emprendedora
            </h2>

            <p className="mt-2 text-sm leading-6 text-ink-500">
              Completa los datos iniciales. Después podrás crear tu perfil y
              emprendimiento.
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label="Nombres"
                placeholder="Ej: María"
                error={errors.firstName?.message}
                {...register("firstName")}
              />

              <Input
                label="Apellidos"
                placeholder="Ej: Pérez"
                error={errors.lastName?.message}
                {...register("lastName")}
              />
            </div>

            <Input
              label="Correo electrónico"
              type="email"
              autoComplete="email"
              placeholder="correo@ejemplo.com"
              error={errors.email?.message}
              {...register("email")}
            />

            <div className="relative">
              <Input
                label="Contraseña"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Mínimo 8 caracteres"
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

            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label="Teléfono"
                placeholder="3000000000"
                error={errors.phone?.message}
                {...register("phone")}
              />

              <Input
                label="WhatsApp"
                placeholder="3000000000"
                error={errors.whatsapp?.message}
                {...register("whatsapp")}
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label="Ciudad"
                placeholder="Barranquilla"
                error={errors.city?.message}
                {...register("city")}
              />

              <Input
                label="Departamento"
                placeholder="Atlántico"
                error={errors.department?.message}
                {...register("department")}
              />
            </div>

            {error ? (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            ) : null}

            {successMessage ? (
              <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                {successMessage}
              </div>
            ) : null}

            <Button
              type="submit"
              className="w-full"
              isLoading={status === "loading"}
            >
              Crear cuenta
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500">
            ¿Ya tienes cuenta?{" "}
            <Link
              to={paths.public.login}
              className="font-semibold text-primary-600 hover:text-primary-700"
            >
              Iniciar sesión
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
