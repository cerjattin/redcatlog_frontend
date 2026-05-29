import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        {eyebrow ? (
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">
            {eyebrow}
          </p>
        ) : null}

        <h1 className="mt-2 text-3xl font-bold text-ink-900">{title}</h1>

        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-500">
            {description}
          </p>
        ) : null}
      </div>

      {actions ? <div className="flex gap-3">{actions}</div> : null}
    </div>
  );
}
