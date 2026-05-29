import { api } from "@/lib/axios";
import type {
  EntrepreneurProfile,
  UpdateEntrepreneurProfileRequest,
} from "@/features/entrepreneurs/types/entrepreneur.types";

type EntrepreneurEnvelope = {
  success: boolean;
  message: string;
  data: EntrepreneurProfile;
};

export const entrepreneurService = {
  async getMyProfile(): Promise<EntrepreneurProfile> {
    const { data } = await api.get<EntrepreneurEnvelope>("/entrepreneurs/me");

    return data.data;
  },

  async updateMyProfile(
    payload: UpdateEntrepreneurProfileRequest,
  ): Promise<EntrepreneurProfile> {
    const { data } = await api.put<EntrepreneurEnvelope>(
      "/entrepreneurs/me",
      payload,
    );

    return data.data;
  },
};
