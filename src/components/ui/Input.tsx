import type { InputHTMLAttributes } from "react";

import { cn } from "@/utils/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  wrapperClassName?: string;
};

export function Input({
  label,
  error,
  className,
  wrapperClassName,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? props.name;

  return (
    <label className={cn("block", wrapperClassName)}>
      {label ? (
        <span className="mb-2 block text-sm font-semibold text-ink-700">
          {label}
        </span>
      ) : null}

      <input
        id={inputId}
        className={cn(
          "h-11 w-full rounded-xl border border-ink-100 bg-white px-4 text-sm text-ink-900 outline-none transition placeholder:text-ink-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100",
          error ? "border-red-300 focus:border-red-500 focus:ring-red-100" : "",
          className,
        )}
        {...props}
      />

      {error ? (
        <span className="mt-2 block text-xs font-medium text-red-600">
          {error}
        </span>
      ) : null}
    </label>
  );
}
