import { api } from "@/lib/axios";
import type {
  AdminBusiness,
  AdminBusinessListQuery,
  AdminBusinessListResponse,
  RejectBusinessRequest,
  UpdateBusinessStatusRequest,
} from "@/features/admin/businesses/types/adminBusiness.types";

type AdminBusinessListEnvelope = {
  success: boolean;
  message: string;
  data: AdminBusinessListResponse;
};

type AdminBusinessEnvelope = {
  success: boolean;
  message: string;
  data: AdminBusiness;
};

function buildQueryParams(query: AdminBusinessListQuery) {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });

  return params.toString();
}

export const adminBusinessService = {
  async listBusinesses(
    query: AdminBusinessListQuery = {},
  ): Promise<AdminBusinessListResponse> {
    const queryString = buildQueryParams(query);

    const { data } = await api.get<AdminBusinessListEnvelope>(
      queryString ? `/businesses?${queryString}` : "/businesses",
    );

    return data.data;
  },

  async getBusinessById(id: string): Promise<AdminBusiness> {
    const { data } = await api.get<AdminBusinessEnvelope>(`/businesses/${id}`);

    return data.data;
  },

  async approveBusiness(id: string): Promise<AdminBusiness> {
    const { data } = await api.patch<AdminBusinessEnvelope>(
      `/businesses/${id}/approve`,
    );

    return data.data;
  },

  async rejectBusiness(
    id: string,
    payload: RejectBusinessRequest,
  ): Promise<AdminBusiness> {
    const { data } = await api.patch<AdminBusinessEnvelope>(
      `/businesses/${id}/reject`,
      payload,
    );

    return data.data;
  },

  async updateBusinessStatus(
    id: string,
    payload: UpdateBusinessStatusRequest,
  ): Promise<AdminBusiness> {
    const { data } = await api.patch<AdminBusinessEnvelope>(
      `/businesses/${id}/status`,
      payload,
    );

    return data.data;
  },
};
