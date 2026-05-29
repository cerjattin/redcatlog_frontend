import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { KeyRound } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { passwordService } from "@/features/auth/api/password.service";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/features/auth/schemas/password.schema";
import { paths } from "@/routes/paths";

function getApiErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { message?: string } | undefined;

    return data?.message ?? "No fue posible cambiar la contraseña.";
  }

  return "No fue posible cambiar la contraseña.";
}

function clearAuthSession() {
  localStorage.removeItem("red-mujeres-auth");
}

export function ChangePasswordPage() {
  const navigate = useNavigate();

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: ChangePasswordFormValues) {
    try {
      setSubmitError(null);
      setSuccessMessage(null);

      await passwordService.changeMyPassword(values);

      setSuccessMessage(
        "Contraseña actualizada correctamente. Serás redirigido al inicio de sesión.",
      );

      clearAuthSession();

      window.setTimeout(() => {
        navigate(paths.public.login, { replace: true });
      }, 1200);
    } catch (error) {
      setSubmitError(getApiErrorMessage(error));
    }
  }

  return (
    <main className="min-h-screen bg-ink-50 px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-xl items-center">
        <Card className="w-full">
          <div className="mb-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
              <KeyRound className="h-6 w-6" />
            </div>

            <h1 className="text-2xl font-bold text-ink-900">
              Cambiar contraseña
            </h1>

            <p className="mt-2 text-sm leading-6 text-ink-500">
              Por seguridad, ingresa tu contraseña actual y define una nueva
              contraseña para continuar usando la plataforma.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <Input
                label="Contraseña actual"
                type="password"
                placeholder="Ingresa tu contraseña actual"
                error={errors.currentPassword?.message}
                {...register("currentPassword")}
              />

              <Input
                label="Nueva contraseña"
                type="password"
                placeholder="NuevaClave123*"
                error={errors.newPassword?.message}
                {...register("newPassword")}
              />

              <Input
                label="Confirmar nueva contraseña"
                type="password"
                placeholder="Repite la nueva contraseña"
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />
            </div>

            {submitError ? (
              <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {submitError}
              </div>
            ) : null}

            {successMessage ? (
              <div className="mt-5 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                {successMessage}
              </div>
            ) : null}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(-1)}
              >
                Cancelar
              </Button>

              <Button type="submit" isLoading={isSubmitting}>
                <KeyRound className="mr-2 h-4 w-4" />
                Cambiar contraseña
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  );
}
