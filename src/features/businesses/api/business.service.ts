import axios from "axios";

import { api } from "@/lib/axios";
import { env } from "@/lib/env";
import type {
  BusinessDetail,
  BusinessSummary,
  CreateBusinessRequest,
  UpdateBusinessRequest,
  UploadBusinessImageResponse,
} from "@/features/businesses/types/business.types";

type BusinessListEnvelope = {
  success: boolean;
  message: string;
  data:
    | BusinessSummary[]
    | {
        items?: BusinessSummary[];
        businesses?: BusinessSummary[];
      };
};

type BusinessDetailEnvelope = {
  success: boolean;
  message: string;
  data:
    | BusinessDetail
    | {
        business?: BusinessDetail;
      };
};

type UploadBusinessImageEnvelope = {
  success: boolean;
  message: string;
  data: UploadBusinessImageResponse;
};

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE_MB = 3;

function getAccessToken() {
  const rawAuth = localStorage.getItem("red-mujeres-auth");

  if (!rawAuth) {
    return null;
  }

  try {
    return JSON.parse(rawAuth)?.state?.accessToken ?? null;
  } catch {
    return null;
  }
}

function validateImageFile(file: File) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Formato no permitido. Usa JPG, PNG o WEBP.");
  }

  if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
    throw new Error(`La imagen no puede superar ${MAX_IMAGE_SIZE_MB} MB.`);
  }
}

function unwrapBusinessList(envelope: BusinessListEnvelope): BusinessSummary[] {
  if (Array.isArray(envelope.data)) {
    return envelope.data;
  }

  return envelope.data.items ?? envelope.data.businesses ?? [];
}

function unwrapBusinessDetail(
  envelope: BusinessDetailEnvelope,
): BusinessDetail {
  if (
    envelope.data &&
    typeof envelope.data === "object" &&
    "business" in envelope.data &&
    envelope.data.business
  ) {
    return envelope.data.business;
  }

  return envelope.data as BusinessDetail;
}

export const businessService = {
  async listMyBusinesses(): Promise<BusinessSummary[]> {
    const { data } = await api.get<BusinessListEnvelope>("/businesses/me");

    return unwrapBusinessList(data);
  },

  async getMyBusinessById(id: string): Promise<BusinessDetail> {
    const { data } = await api.get<BusinessDetailEnvelope>(
      `/businesses/me/${id}`,
    );

    return unwrapBusinessDetail(data);
  },

  async createMyBusiness(
    payload: CreateBusinessRequest,
  ): Promise<BusinessDetail> {
    const { data } = await api.post<BusinessDetailEnvelope>(
      "/businesses",
      payload,
    );

    return unwrapBusinessDetail(data);
  },

  async updateMyBusiness(
    id: string,
    payload: UpdateBusinessRequest,
  ): Promise<BusinessDetail> {
    const { data } = await api.put<BusinessDetailEnvelope>(
      `/businesses/me/${id}`,
      payload,
    );

    return unwrapBusinessDetail(data);
  },

  async uploadBusinessImage(
    file: File,
    metadata?: {
      title?: string;
      description?: string;
      altText?: string;
    },
  ): Promise<UploadBusinessImageResponse> {
    validateImageFile(file);

    const formData = new FormData();

    formData.append("image", file);

    if (metadata?.title) {
      formData.append("title", metadata.title);
    }

    if (metadata?.description) {
      formData.append("description", metadata.description);
    }

    if (metadata?.altText) {
      formData.append("altText", metadata.altText);
    }

    const accessToken = getAccessToken();

    const response = await axios.post<UploadBusinessImageEnvelope>(
      `${env.apiBaseUrl}/uploads/images/businesses`,
      formData,
      {
        headers: accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : undefined,
      },
    );

    return response.data.data;
  },
};
