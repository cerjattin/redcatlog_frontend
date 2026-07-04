import { ClipboardCheck, Package, Tags, UserRoundCheck } from "lucide-react";
import { Link } from "react-router-dom";

import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { paths } from "@/routes/paths";

const editorActions = [
  {
    title: "Emprendedoras",
    description: "Crear, editar, revisar y aprobar perfiles de emprendedoras.",
    href: paths.admin.entrepreneurs,
    icon: UserRoundCheck,
  },
  {
    title: "Productos",
    description: "Crear productos, cargar imágenes y gestionar estados.",
    href: paths.admin.products,
    icon: Package,
  },
  {
    title: "Categorías",
    description: "Administrar categorías para productos y emprendedoras.",
    href: paths.admin.categories,
    icon: Tags,
  },
  {
    title: "Aprobaciones",
    description: "Revisar elementos pendientes de aprobación.",
    href: paths.admin.approvals,
    icon: ClipboardCheck,
  },
];

export function EditorDashboardPage() {
  return (
    <section>
      <PageHeader
        eyebrow="Editor"
        title="Panel editorial"
        description="Gestiona el contenido operativo de REDMUEMMA."
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {editorActions.map((item) => {
          const Icon = item.icon;

          return (
            <Link key={item.href} to={item.href}>
              <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                  <Icon className="h-6 w-6" />
                </div>

                <h2 className="mt-5 text-lg font-bold text-ink-900">
                  {item.title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-ink-500">
                  {item.description}
                </p>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
