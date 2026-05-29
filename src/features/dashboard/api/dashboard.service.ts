import { api } from "@/lib/axios";
import type { EntrepreneurDashboardOverview } from "@/features/dashboard/types/dashboard.types";

type BackendDashboardEnvelope = {
  success: boolean;
  message: string;
  data: EntrepreneurDashboardOverview;
};

export const dashboardService = {
  async getMyOverview(): Promise<EntrepreneurDashboardOverview> {
    const { data } = await api.get<BackendDashboardEnvelope>(
      "/dashboard/me/overview",
    );

    return data.data;
  },
};
