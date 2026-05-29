import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/utils/cn";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Card({ children, className, ...props }: CardProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-ink-100 bg-white p-6 shadow-sm",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}
