type LoaderProps = {
  label?: string;
};

export function Loader({ label = "Cargando..." }: LoaderProps) {
  return (
    <div className="flex min-h-40 items-center justify-center gap-3 text-sm font-medium text-ink-500">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
      {label}
    </div>
  );
}
