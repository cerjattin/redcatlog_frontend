import { useEffect, useState } from "react";

import { EmptyState } from "@/components/feedback/EmptyState";
import { Loader } from "@/components/feedback/Loader";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { dashboardService } from "@/features/dashboard/api/dashboard.service";
import type { EntrepreneurDashboardOverview } from "@/features/dashboard/types/dashboard.types";

export function EntrepreneurDashboardPage() {
  const [overview, setOverview] =
    useState<EntrepreneurDashboardOverview | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOverview() {
      try {
        setIsLoading(true);
        setError(null);

        const data = await dashboardService.getMyOverview();

        setOverview(data);
      } catch {
        setError("No fue posible cargar el resumen del dashboard.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadOverview();
  }, []);

  if (isLoading) {
    return <Loader label="Cargando dashboard..." />;
  }

  if (error) {
    return (
      <EmptyState title="No se pudo cargar el dashboard" description={error} />
    );
  }

  const stats = [
    {
      label: "Productos",
      value: overview?.productsCount ?? 0,
      status: "Registrados",
      variant: "neutral" as const,
    },
    {
      label: "Productos pendientes",
      value: overview?.pendingProductsCount ?? 0,
      status: "En revisión",
      variant: "warning" as const,
    },
    {
      label: "Productos aprobados",
      value: overview?.approvedProductsCount ?? 0,
      status: "Visibles",
      variant: "success" as const,
    },
    {
      label: "Emprendimientos",
      value: overview?.businessesCount ?? 0,
      status: "Registrados",
      variant: "info" as const,
    },
  ];

  return (
    <section>
      <PageHeader
        eyebrow="Emprendedora"
        title="Dashboard de emprendedora"
        description="Resumen general de tus emprendimientos, productos y estados de aprobación."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <Card key={item.label}>
            <p className="text-sm text-ink-500">{item.label}</p>

            <strong className="mt-2 block text-3xl text-ink-900">
              {item.value}
            </strong>

            <div className="mt-4">
              <Badge variant={item.variant}>{item.status}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
