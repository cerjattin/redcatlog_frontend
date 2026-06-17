import axios from "axios";

import { api } from "@/lib/axios";
import type {
  CreateEntrepreneurProfileRequest,
  EntrepreneurProfile,
  UpdateEntrepreneurProfileRequest,
} from "@/features/entrepreneurs/types/entrepreneur.types";

type EntrepreneurEnvelope = {
  success: boolean;
  message: string;
  data:
    | EntrepreneurProfile
    | {
        entrepreneur: EntrepreneurProfile;
      };
};

function unwrapEntrepreneurProfile(
  envelope: EntrepreneurEnvelope,
): EntrepreneurProfile {
  const payload = envelope.data;

  if (
    payload &&
    typeof payload === "object" &&
    "entrepreneur" in payload &&
    payload.entrepreneur
  ) {
    return payload.entrepreneur;
  }

  return payload as EntrepreneurProfile;
}

export const entrepreneurService = {
  async getMyProfile(): Promise<EntrepreneurProfile | null> {
    try {
      const { data } = await api.get<EntrepreneurEnvelope>("/entrepreneurs/me");

      return unwrapEntrepreneurProfile(data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }

      throw error;
    }
  },

  async createMyProfile(
    payload: CreateEntrepreneurProfileRequest,
  ): Promise<EntrepreneurProfile> {
    const { data } = await api.post<EntrepreneurEnvelope>(
      "/entrepreneurs",
      payload,
    );

    return unwrapEntrepreneurProfile(data);
  },

  async updateMyProfile(
    payload: UpdateEntrepreneurProfileRequest,
  ): Promise<EntrepreneurProfile> {
    const { data } = await api.put<EntrepreneurEnvelope>(
      "/entrepreneurs/me",
      payload,
    );

    return unwrapEntrepreneurProfile(data);
  },
};
