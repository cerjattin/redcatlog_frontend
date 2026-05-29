import { AppInitializer } from "@/app/AppInitializer";
import { AppRouter } from "@/routes/AppRouter";

export default function App() {
  return (
    <AppInitializer>
      <AppRouter />
    </AppInitializer>
  );
}
