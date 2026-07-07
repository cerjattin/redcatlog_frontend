import { ImageOff, Upload, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";

import { Button } from "@/components/ui/Button";

const MAX_IMAGE_SIZE_MB = 3;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

type ImageFilePickerProps = {
  label: string;
  description: string;
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  currentImageUrl?: string | null;
};

function validateFile(file: File) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Formato no permitido. Usa JPG, PNG o WEBP.";
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return `Cada imagen debe pesar máximo ${MAX_IMAGE_SIZE_MB} MB.`;
  }

  return null;
}

export function ImageFilePicker({
  label,
  description,
  files,
  onFilesChange,
  maxFiles = 1,
  currentImageUrl,
}: ImageFilePickerProps) {
  const [error, setError] = useState<string | null>(null);

  const previews = useMemo(
    () => files.map((file) => URL.createObjectURL(file)),
    [files],
  );

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [previews]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const incomingFiles = Array.from(event.target.files ?? []);
    event.target.value = "";
    setError(null);

    if (incomingFiles.length === 0) return;

    const availableSlots = maxFiles - files.length;

    if (availableSlots <= 0 || incomingFiles.length > availableSlots) {
      setError(`Puedes seleccionar máximo ${maxFiles} imagen${maxFiles === 1 ? "" : "es"}.`);
      return;
    }

    for (const file of incomingFiles) {
      const validationError = validateFile(file);

      if (validationError) {
        setError(validationError);
        return;
      }
    }

    onFilesChange([...files, ...incomingFiles]);
  }

  function removeFile(index: number) {
    onFilesChange(files.filter((_, fileIndex) => fileIndex !== index));
    setError(null);
  }

  const showCurrentImage = previews.length === 0 && currentImageUrl;

  return (
    <div className="rounded-2xl border border-ink-100 bg-ink-50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-ink-900">{label}</h2>
          <p className="mt-1 text-xs leading-5 text-ink-500">{description}</p>
        </div>

        <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-primary-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-primary-700">
          <Upload className="mr-2 h-4 w-4" />
          Seleccionar
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple={maxFiles > 1}
            className="sr-only"
            onChange={handleChange}
          />
        </label>
      </div>

      <div className={`mt-4 grid gap-3 ${maxFiles > 1 ? "sm:grid-cols-3" : "grid-cols-1"}`}>
        {previews.map((preview, index) => (
          <div
            key={`${files[index]?.name}-${files[index]?.lastModified}`}
            className="relative overflow-hidden rounded-xl border border-ink-100 bg-white"
          >
            <img
              src={preview}
              alt={`Vista previa ${index + 1}`}
              className="h-44 w-full object-cover"
            />
            <Button
              type="button"
              variant="danger"
              size="sm"
              className="absolute right-2 top-2 h-8 w-8 px-0"
              aria-label={`Eliminar imagen ${index + 1}`}
              onClick={() => removeFile(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {showCurrentImage ? (
          <div className="overflow-hidden rounded-xl border border-ink-100 bg-white">
            <img
              src={currentImageUrl}
              alt="Imagen actual"
              className="h-44 w-full object-cover"
            />
          </div>
        ) : null}

        {previews.length === 0 && !showCurrentImage ? (
          <div className="flex h-44 items-center justify-center rounded-xl border border-dashed border-ink-100 bg-white text-ink-400">
            <div className="text-center">
              <ImageOff className="mx-auto h-7 w-7" />
              <p className="mt-2 text-xs">Sin imagen seleccionada</p>
            </div>
          </div>
        ) : null}
      </div>

      <p className="mt-3 text-xs text-ink-400">
        JPG, PNG o WEBP · Máximo {MAX_IMAGE_SIZE_MB} MB por imagen
      </p>

      {error ? (
        <p className="mt-2 text-xs font-medium text-red-600">{error}</p>
      ) : null}
    </div>
  );
}
