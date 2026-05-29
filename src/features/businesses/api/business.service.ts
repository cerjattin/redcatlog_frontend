import { api } from "@/lib/axios";
import type {
  BusinessDetail,
  BusinessSummary,
} from "@/features/businesses/types/business.types";

type BusinessListEnvelope = {
  success: boolean;
  message: string;
  data: BusinessSummary[];
};

type BusinessDetailEnvelope = {
  success: boolean;
  message: string;
  data: BusinessDetail;
};

export const businessService = {
  async listMyBusinesses(): Promise<BusinessSummary[]> {
    const { data } = await api.get<BusinessListEnvelope>("/businesses/me");

    return data.data;
  },

  async getMyBusinessById(id: string): Promise<BusinessDetail> {
    const { data } = await api.get<BusinessDetailEnvelope>(
      `/businesses/me/${id}`,
    );

    return data.data;
  },
  async updateMyBusiness(
    id: string,
    payload: Partial<BusinessDetail>,
  ): Promise<BusinessDetail> {
    const { data } = await api.put<BusinessDetailEnvelope>(
      `/businesses/me/${id}`,
      payload,
    );

    return data.data;
  },
};
