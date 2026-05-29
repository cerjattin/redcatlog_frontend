import { useEffect, useState, type ReactNode } from "react";

import { Loader } from "@/components/feedback/Loader";
import { useAuthStore } from "@/store/auth.store";

type AppInitializerProps = {
  children: ReactNode;
};

export function AppInitializer({ children }: AppInitializerProps) {
  const [ready, setReady] = useState(false);

  const accessToken = useAuthStore((state) => state.accessToken);
  const loadMe = useAuthStore((state) => state.loadMe);

  useEffect(() => {
    async function initialize() {
      try {
        if (accessToken) {
          await loadMe();
        }
      } finally {
        setReady(true);
      }
    }

    void initialize();
  }, [accessToken, loadMe]);

  if (!ready) {
    return <Loader label="Inicializando aplicación..." />;
  }

  return children;
}
