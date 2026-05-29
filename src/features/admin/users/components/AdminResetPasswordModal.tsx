import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { KeyRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { passwordService } from "@/features/auth/api/password.service";
import {
  adminResetPasswordSchema,
  type AdminResetPasswordFormValues,
} from "@/features/auth/schemas/password.schema";

type AdminResetPasswordModalProps = {
  userId: string;
  userName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

function getApiErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { message?: string } | undefined;

    return data?.message ?? "No fue posible restablecer la contraseña.";
  }

  return "No fue posible restablecer la contraseña.";
}

export function AdminResetPasswordModal({
  userId,
  userName,
  isOpen,
  onClose,
  onSuccess,
}: AdminResetPasswordModalProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdminResetPasswordFormValues>({
    resolver: zodResolver(adminResetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
      forcePasswordChange: true,
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        newPassword: "",
        confirmPassword: "",
        forcePasswordChange: true,
      });

      setSubmitError(null);
    }
  }, [isOpen, reset]);

  async function onSubmit(values: AdminResetPasswordFormValues) {
    try {
      setSubmitError(null);

      await passwordService.adminResetUserPassword(userId, {
        newPassword: values.newPassword,
        forcePasswordChange: values.forcePasswordChange,
      });

      reset({
        newPassword: "",
        confirmPassword: "",
        forcePasswordChange: true,
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      setSubmitError(getApiErrorMessage(error));
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <Card className="w-full max-w-lg">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
              <KeyRound className="h-5 w-5" />
            </div>

            <h2 className="text-xl font-bold text-ink-900">
              Restablecer contraseña
            </h2>

            <p className="mt-2 text-sm leading-6 text-ink-500">
              Asignarás una nueva contraseña temporal para{" "}
              <span className="font-semibold text-ink-700">{userName}</span>.
            </p>
          </div>

          <button
            type="button"
            className="rounded-xl p-2 text-ink-400 transition hover:bg-ink-50 hover:text-ink-700"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4">
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

            <label className="flex items-start gap-3 rounded-xl border border-ink-100 bg-ink-50 px-4 py-3 text-sm font-medium text-ink-700">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-ink-300 text-primary-600"
                {...register("forcePasswordChange")}
              />

              <span>
                Forzar cambio de contraseña en el próximo inicio de sesión.
              </span>
            </label>
          </div>

          {submitError ? (
            <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {submitError}
            </div>
          ) : null}

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancelar
            </Button>

            <Button type="submit" isLoading={isSubmitting}>
              <KeyRound className="mr-2 h-4 w-4" />
              Restablecer clave
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
