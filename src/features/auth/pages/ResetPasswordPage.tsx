import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { KeyRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { passwordService } from "@/features/auth/api/password.service";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/features/auth/schemas/password.schema";
import { paths } from "@/routes/paths";

function getApiErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { message?: string } | undefined;

    return data?.message ?? "No fue posible restablecer la contraseña.";
  }

  return "No fue posible restablecer la contraseña.";
}

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      setValue("token", token);
    }
  }, [searchParams, setValue]);

  async function onSubmit(values: ResetPasswordFormValues) {
    try {
      setSubmitError(null);
      setSuccessMessage(null);

      await passwordService.resetPassword(values);

      setSuccessMessage(
        "Contraseña restablecida correctamente. Ya puedes iniciar sesión.",
      );

      window.setTimeout(() => {
        navigate(paths.public.login, { replace: true });
      }, 1500);
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
              Restablecer contraseña
            </h1>

            <p className="mt-2 text-sm leading-6 text-ink-500">
              Ingresa el token recibido y define una nueva contraseña segura.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <Input
                label="Token"
                placeholder="Token de recuperación"
                error={errors.token?.message}
                {...register("token")}
              />

              <Input
                label="Nueva contraseña"
                type="password"
                placeholder="NuevaClave123*"
                error={errors.newPassword?.message}
                {...register("newPassword")}
              />

              <Input
                label="Confirmar contraseña"
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

            <Button
              className="mt-6 w-full"
              type="submit"
              isLoading={isSubmitting}
            >
              <KeyRound className="mr-2 h-4 w-4" />
              Restablecer contraseña
            </Button>
          </form>

          <Link
            to={paths.public.login}
            className="mt-6 block text-center text-sm font-semibold text-primary-600"
          >
            Volver al inicio de sesión
          </Link>
        </Card>
      </div>
    </main>
  );
}
