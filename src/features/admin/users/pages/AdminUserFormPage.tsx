import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, EyeOff, Save } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { adminUserService } from "@/features/admin/users/api/adminUser.service";
import {
  adminUserCreateSchema,
  type AdminUserCreateFormValues,
} from "@/features/admin/users/schemas/adminUser.schema";
import type { CreateAdminUserPayload } from "@/features/admin/users/types/adminUser.types";
import { paths } from "@/routes/paths";

function nullable(value?: string) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function getAdminUserDetailPath(id: string) {
  return paths.admin.userDetail.replace(":id", id);
}

export function AdminUserFormPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminUserCreateFormValues>({
    resolver: zodResolver(adminUserCreateSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "editor",
      status: "active",
      phone: "",
      whatsapp: "",
      city: "",
      department: "",
      country: "Colombia",
      forcePasswordChange: true,
    },
  });

  async function onSubmit(values: AdminUserCreateFormValues) {
    try {
      setSubmitError(null);

      const payload: CreateAdminUserPayload = {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
        role: values.role,
        status: values.status,
        phone: nullable(values.phone),
        whatsapp: nullable(values.whatsapp),
        city: nullable(values.city),
        department: nullable(values.department),
        country: nullable(values.country) ?? "Colombia",
        forcePasswordChange: values.forcePasswordChange,
      };

      const user = await adminUserService.createUser(payload);

      navigate(getAdminUserDetailPath(user.id), {
        replace: true,
      });
    } catch {
      setSubmitError(
        "No fue posible crear el usuario. Verifica los datos o confirma el contrato del backend.",
      );
    }
  }

  return (
    <section>
      <PageHeader
        eyebrow="Administracion"
        title="Crear usuario"
        description="Crea cuentas para apoyar la administracion del sitio. Usa el rol Editor para delegar gestion de contenido sin acceso a usuarios."
        actions={
          <Button variant="secondary" onClick={() => navigate(paths.admin.users)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        }
      />

      <Card>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Nombres"
              placeholder="Ej: Ana"
              error={errors.firstName?.message}
              {...register("firstName")}
            />
            <Input
              label="Apellidos"
              placeholder="Ej: Gomez"
              error={errors.lastName?.message}
              {...register("lastName")}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Correo electronico"
              type="email"
              autoComplete="email"
              placeholder="correo@redmuemma.com"
              error={errors.email?.message}
              {...register("email")}
            />

            <div className="relative">
              <Input
                label="Contrasena temporal"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Minimo 8 caracteres"
                error={errors.password?.message}
                {...register("password")}
              />
              <button
                type="button"
                className="absolute right-3 top-9 rounded-lg p-1 text-ink-400 hover:bg-ink-50 hover:text-ink-700"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={
                  showPassword ? "Ocultar contrasena" : "Mostrar contrasena"
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

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-ink-700">
                Rol
              </span>
              <select
                className="h-11 w-full rounded-xl border border-ink-100 bg-white px-4 text-sm text-ink-900 outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
                {...register("role")}
              >
                <option value="editor">Editor</option>
                <option value="admin">Administrador</option>
                <option value="entrepreneur">Emprendedora</option>
              </select>
              {errors.role?.message ? (
                <span className="mt-2 block text-xs font-medium text-red-600">
                  {errors.role.message}
                </span>
              ) : null}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-ink-700">
                Estado inicial
              </span>
              <select
                className="h-11 w-full rounded-xl border border-ink-100 bg-white px-4 text-sm text-ink-900 outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
                {...register("status")}
              >
                <option value="active">Activo</option>
                <option value="pending">Pendiente</option>
                <option value="inactive">Inactivo</option>
              </select>
              {errors.status?.message ? (
                <span className="mt-2 block text-xs font-medium text-red-600">
                  {errors.status.message}
                </span>
              ) : null}
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Telefono"
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

          <div className="grid gap-5 md:grid-cols-3">
            <Input
              label="Ciudad"
              placeholder="Barranquilla"
              error={errors.city?.message}
              {...register("city")}
            />
            <Input
              label="Departamento"
              placeholder="Atlantico"
              error={errors.department?.message}
              {...register("department")}
            />
            <Input
              label="Pais"
              placeholder="Colombia"
              error={errors.country?.message}
              {...register("country")}
            />
          </div>

          <label className="flex items-start gap-3 rounded-2xl border border-ink-100 bg-ink-50 p-4">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-ink-300 text-primary-600 focus:ring-primary-500"
              {...register("forcePasswordChange")}
            />
            <span>
              <span className="block text-sm font-semibold text-ink-900">
                Solicitar cambio de contrasena al iniciar sesion
              </span>
              <span className="mt-1 block text-sm leading-6 text-ink-500">
                Recomendado para cuentas creadas por administracion con una
                contrasena temporal.
              </span>
            </span>
          </label>

          {submitError ? (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {submitError}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              variant="secondary"
              disabled={isSubmitting}
              onClick={() => navigate(paths.admin.users)}
            >
              Cancelar
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              Crear usuario
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
}
