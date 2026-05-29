import { Link } from "react-router-dom";

import { paths } from "@/routes/paths";

export function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink-50 px-4">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">
          Acceso restringido
        </p>

        <h1 className="mt-3 text-2xl font-bold text-ink-900">
          No tienes permisos para acceder
        </h1>

        <p className="mt-3 text-sm leading-6 text-ink-500">
          Tu usuario no cuenta con el rol necesario para ingresar a esta
          sección.
        </p>

        <Link
          to={paths.public.login}
          className="mt-6 inline-flex rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
        >
          Volver al login
        </Link>
      </section>
    </main>
  );
}
