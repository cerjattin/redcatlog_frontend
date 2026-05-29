import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { ArrowLeft, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { passwordService } from "@/features/auth/api/password.service";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/features/auth/schemas/password.schema";
import { paths } from "@/routes/paths";

function getApiErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { message?: string } | undefined;

    return data?.message ?? "No fue posible procesar la solicitud.";
  }

  return "No fue posible procesar la solicitud.";
}

export function ForgotPasswordPage() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [devResetToken, setDevResetToken] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    try {
      setSubmitError(null);
      setSuccessMessage(null);
      setDevResetToken(null);

      const response = await passwordService.forgotPassword(values);

      setSuccessMessage(response.message);

      if (response.resetToken) {
        setDevResetToken(response.resetToken);
      }
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
              <Mail className="h-6 w-6" />
            </div>

            <h1 className="text-2xl font-bold text-ink-900">
              Recuperar contraseña
            </h1>

            <p className="mt-2 text-sm leading-6 text-ink-500">
              Ingresa tu correo. Si existe en la plataforma, recibirás
              instrucciones para restablecer tu contraseña.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Correo electrónico"
              type="email"
              placeholder="correo@ejemplo.com"
              error={errors.email?.message}
              {...register("email")}
            />

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

            {devResetToken ? (
              <div className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <p className="font-semibold">Token de desarrollo:</p>
                <p className="mt-2 break-all font-mono text-xs">
                  {devResetToken}
                </p>

                <Link
                  className="mt-3 inline-block text-sm font-semibold text-primary-600"
                  to={`${paths.auth.resetPassword}?token=${devResetToken}`}
                >
                  Ir a restablecer contraseña
                </Link>
              </div>
            ) : null}

            <Button
              className="mt-6 w-full"
              type="submit"
              isLoading={isSubmitting}
            >
              Enviar instrucciones
            </Button>
          </form>

          <Link
            to={paths.public.login}
            className="mt-6 flex items-center justify-center text-sm font-semibold text-primary-600"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al inicio de sesión
          </Link>
        </Card>
      </div>
    </main>
  );
}
