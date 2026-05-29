import axios from "axios";

import { api } from "@/lib/axios";
import { env } from "@/lib/env";
import type {
  CreateProductRequest,
  ProductSummary,
} from "@/features/products/types/product.types";

type ProductListEnvelope = {
  success: boolean;
  message: string;
  data: ProductSummary[];
};

type ProductDetailEnvelope = {
  success: boolean;
  message: string;
  data: ProductSummary;
};

type UploadImageEnvelope = {
  success: boolean;
  message: string;
  data: {
    url?: string;
    imageUrl?: string;
    fileUrl?: string;
    path?: string;
    filename?: string;
  };
};

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

function resolveUploadedImageUrl(data: UploadImageEnvelope) {
  const imageUrl =
    data.data.imageUrl ?? data.data.url ?? data.data.fileUrl ?? data.data.path;

  if (!imageUrl) {
    throw new Error("El backend no devolvió la URL de la imagen subida.");
  }

  return imageUrl;
}

export const productService = {
  async listMyProducts(): Promise<ProductSummary[]> {
    const { data } = await api.get<ProductListEnvelope>("/products/me");

    return data.data;
  },

  async getMyProductById(id: string): Promise<ProductSummary> {
    const { data } = await api.get<ProductDetailEnvelope>(`/products/me/${id}`);

    return data.data;
  },

  async createMyProduct(
    payload: CreateProductRequest,
  ): Promise<ProductSummary> {
    const { data } = await api.post<ProductDetailEnvelope>(
      "/products",
      payload,
    );

    return data.data;
  },

  async updateMyProduct(
    id: string,
    payload: Partial<ProductSummary>,
  ): Promise<ProductSummary> {
    const { data } = await api.put<ProductDetailEnvelope>(
      `/products/me/${id}`,
      payload,
    );

    return data.data;
  },

  async uploadProductImage(
    productId: string,
    file: File,
  ): Promise<ProductSummary> {
    const formData = new FormData();

    formData.append("image", file, file.name);

    const accessToken = getAccessToken();

    const uploadResponse = await axios.post<UploadImageEnvelope>(
      `${env.apiBaseUrl}/uploads/images/products`,
      formData,
      {
        headers: accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : undefined,
      },
    );

    const imageUrl = resolveUploadedImageUrl(uploadResponse.data);

    const product = await this.getMyProductById(productId);

    const usedSortOrders =
      product.images
        ?.map((image) => image.sortOrder)
        .filter(
          (sortOrder): sortOrder is number => typeof sortOrder === "number",
        ) ?? [];

    const nextSortOrder =
      [1, 2, 3].find((order) => !usedSortOrders.includes(order)) ?? 1;

    await api.post(`/products/${productId}/images`, {
      imageUrl,
      altText: "Imagen del producto",
      sortOrder: nextSortOrder,
      isMain: product.images?.length === 0,
    });

    return this.getMyProductById(productId);
  },

  async deleteProductImage(productId: string, imageId: string): Promise<void> {
    await api.delete(`/products/${productId}/images/${imageId}`);
  },
};
