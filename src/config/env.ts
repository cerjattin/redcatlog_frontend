export const ENV = {
  APP_NAME: import.meta.env.VITE_APP_NAME ?? "Red Mujeres",

  API_BASE_URL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000",

  UPLOADS_BASE_URL:
    import.meta.env.VITE_UPLOADS_BASE_URL ?? "http://localhost:4000",
};
