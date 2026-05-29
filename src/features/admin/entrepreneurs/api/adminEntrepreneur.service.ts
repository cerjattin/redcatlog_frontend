import { api } from "@/lib/axios";
import type {
  AdminEntrepreneur,
  AdminEntrepreneurListQuery,
  AdminEntrepreneurListResponse,
  RejectEntrepreneurRequest,
  UpdateEntrepreneurStatusRequest,
} from "@/features/admin/entrepreneurs/types/adminEntrepreneur.types";

type AdminEntrepreneurListEnvelope = {
  success: boolean;
  message: string;
  data: AdminEntrepreneurListResponse;
};

type AdminEntrepreneurEnvelope = {
  success: boolean;
  message: string;
  data: AdminEntrepreneur;
};

function buildQueryParams(query: AdminEntrepreneurListQuery) {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });

  return params.toString();
}

export const adminEntrepreneurService = {
  async listEntrepreneurs(
    query: AdminEntrepreneurListQuery = {},
  ): Promise<AdminEntrepreneurListResponse> {
    const queryString = buildQueryParams(query);

    const { data } = await api.get<AdminEntrepreneurListEnvelope>(
      queryString ? `/entrepreneurs?${queryString}` : "/entrepreneurs",
    );

    return data.data;
  },

  async getEntrepreneurById(id: string): Promise<AdminEntrepreneur> {
    const { data } = await api.get<AdminEntrepreneurEnvelope>(
      `/entrepreneurs/${id}`,
    );

    return data.data;
  },

  async approveEntrepreneur(id: string): Promise<AdminEntrepreneur> {
    const { data } = await api.patch<AdminEntrepreneurEnvelope>(
      `/entrepreneurs/${id}/approve`,
    );

    return data.data;
  },

  async rejectEntrepreneur(
    id: string,
    payload: RejectEntrepreneurRequest,
  ): Promise<AdminEntrepreneur> {
    const { data } = await api.patch<AdminEntrepreneurEnvelope>(
      `/entrepreneurs/${id}/reject`,
      payload,
    );

    return data.data;
  },

  async updateEntrepreneurStatus(
    id: string,
    payload: UpdateEntrepreneurStatusRequest,
  ): Promise<AdminEntrepreneur> {
    const { data } = await api.patch<AdminEntrepreneurEnvelope>(
      `/entrepreneurs/${id}/status`,
      payload,
    );

    return data.data;
  },
};
