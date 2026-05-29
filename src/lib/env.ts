const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;

const uploadsBaseUrl = import.meta.env.VITE_UPLOADS_BASE_URL as
  | string
  | undefined;

if (!apiBaseUrl) {
  throw new Error("Missing environment variable: VITE_API_BASE_URL");
}

export const env = {
  apiBaseUrl,

  uploadsBaseUrl: uploadsBaseUrl ?? apiBaseUrl.replace(/\/api$/, ""),
};
