import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/layout/PageHeader";

const stats = [
  { label: "Usuarias", value: "0", status: "Registradas" },
  { label: "Emprendimientos", value: "0", status: "Totales" },
  { label: "Productos", value: "0", status: "Catalogados" },
  { label: "Pendientes", value: "0", status: "Por aprobar" },
];

export function AdminDashboardPage() {
  return (
    <section>
      <PageHeader
        eyebrow="Administración"
        title="Dashboard administrador"
        description="Controla usuarias, emprendedoras, emprendimientos, productos, categorías y aprobaciones."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <Card key={item.label}>
            <p className="text-sm text-ink-500">{item.label}</p>

            <strong className="mt-2 block text-3xl text-ink-900">
              {item.value}
            </strong>

            <div className="mt-4">
              <Badge variant="neutral">{item.status}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
