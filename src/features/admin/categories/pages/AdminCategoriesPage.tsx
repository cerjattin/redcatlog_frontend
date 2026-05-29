import { Edit, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { EmptyState } from "@/components/feedback/EmptyState";
import { Loader } from "@/components/feedback/Loader";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { categoryService } from "@/features/admin/categories/api/category.service";
import type {
  Category,
  CategoryType,
} from "@/features/admin/categories/types/category.types";
import { paths } from "@/routes/paths";

function getTypeLabel(type: string) {
  const labels: Record<string, string> = {
    business: "Emprendimiento",
    product: "Producto",
    both: "Ambos",
  };

  return labels[type] ?? type;
}

function getCategoryEditPath(id: string) {
  return paths.admin.editCategory.replace(":id", id);
}

export function AdminCategoriesPage() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState<CategoryType | "">("");
  const [isActive, setIsActive] = useState<"true" | "false" | "">("");
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadCategories() {
    try {
      setIsLoading(true);
      setError(null);

      const data = await categoryService.listCategories({
        search,
        type: type || undefined,
        isActive: isActive || undefined,
      });

      setCategories(data);
    } catch {
      setError("No fue posible cargar las categorías.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadCategories();
  }, [type, isActive]);

  async function handleSearch() {
    await loadCategories();
  }

  async function handleToggleStatus(category: Category) {
    try {
      setActionLoadingId(category.id);

      await categoryService.updateCategoryStatus(category.id, {
        isActive: !category.isActive,
      });

      await loadCategories();
    } finally {
      setActionLoadingId(null);
    }
  }

  if (isLoading) {
    return <Loader label="Cargando categorías..." />;
  }

  if (error) {
    return (
      <EmptyState
        title="No se pudieron cargar las categorías"
        description={error}
      />
    );
  }

  return (
    <section>
      <PageHeader
        eyebrow="Administración"
        title="Gestión de categorías"
        description="Crea, edita, activa o inactiva categorías para productos y emprendimientos."
        actions={
          <Button onClick={() => navigate(paths.admin.newCategory)}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva categoría
          </Button>
        }
      />

      <Card className="mb-5">
        <div className="grid gap-4 md:grid-cols-[1fr_220px_180px_auto]">
          <Input
            placeholder="Buscar por nombre, slug o descripción..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            className="h-11 rounded-xl border border-ink-100 bg-white px-4 text-sm text-ink-900 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
            value={type}
            onChange={(event) =>
              setType(event.target.value as CategoryType | "")
            }
          >
            <option value="">Todos los tipos</option>
            <option value="business">Emprendimiento</option>
            <option value="product">Producto</option>
            <option value="both">Ambos</option>
          </select>

          <select
            className="h-11 rounded-xl border border-ink-100 bg-white px-4 text-sm text-ink-900 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
            value={isActive}
            onChange={(event) =>
              setIsActive(event.target.value as "true" | "false" | "")
            }
          >
            <option value="">Todos</option>
            <option value="true">Activas</option>
            <option value="false">Inactivas</option>
          </select>

          <Button onClick={handleSearch}>
            <Search className="mr-2 h-4 w-4" />
            Buscar
          </Button>
        </div>
      </Card>

      {categories.length === 0 ? (
        <EmptyState
          title="No hay categorías"
          description="No encontramos categorías con los filtros actuales."
        />
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-ink-100">
              <thead className="bg-ink-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-ink-500">
                    Categoría
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-ink-500">
                    Tipo
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-ink-500">
                    Padre
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-ink-500">
                    Orden
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-ink-500">
                    Estado
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-ink-500">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-ink-100 bg-white">
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-ink-900">
                        {category.name}
                      </p>
                      <p className="mt-1 text-xs text-ink-500">
                        /{category.slug}
                      </p>
                      {category.description ? (
                        <p className="mt-2 max-w-md text-xs leading-5 text-ink-500">
                          {category.description}
                        </p>
                      ) : null}
                    </td>

                    <td className="px-5 py-4 text-sm text-ink-600">
                      {getTypeLabel(category.type)}
                    </td>

                    <td className="px-5 py-4 text-sm text-ink-600">
                      {category.parent?.name ?? "Principal"}
                    </td>

                    <td className="px-5 py-4 text-sm text-ink-600">
                      {category.sortOrder}
                    </td>

                    <td className="px-5 py-4">
                      <Badge variant={category.isActive ? "success" : "danger"}>
                        {category.isActive ? "Activa" : "Inactiva"}
                      </Badge>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() =>
                            navigate(getCategoryEditPath(category.id))
                          }
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </Button>

                        <Button
                          variant={category.isActive ? "danger" : "primary"}
                          size="sm"
                          isLoading={actionLoadingId === category.id}
                          onClick={() => handleToggleStatus(category)}
                        >
                          {category.isActive ? "Inactivar" : "Activar"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </section>
  );
}
