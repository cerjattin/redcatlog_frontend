import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

import { Button } from "@/components/ui/Button";

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-ink-100 bg-white p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
        {icon ?? <Inbox className="h-6 w-6" />}
      </div>

      <h2 className="mt-4 text-lg font-bold text-ink-900">{title}</h2>

      {description ? (
        <p className="mt-2 max-w-md text-sm leading-6 text-ink-500">
          {description}
        </p>
      ) : null}

      {actionLabel && onAction ? (
        <Button className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
