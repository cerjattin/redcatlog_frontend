import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";

type ComingSoonPageProps = {
  title: string;
  description?: string;
};

export function ComingSoonPage({ title, description }: ComingSoonPageProps) {
  return (
    <section>
      <PageHeader
        eyebrow="En construcción"
        title={title}
        description={description}
      />

      <Card>
        <p className="text-sm leading-6 text-ink-500">
          Esta interfaz será implementada en las siguientes fases del frontend.
        </p>
      </Card>
    </section>
  );
}
