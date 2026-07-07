import { api } from "@/lib/axios";
import type {
  CreateProductRequest,
  ProductSummary,
  UpdateProductRequest,
} from "@/features/products/types/product.types";

type ProductListEnvelope = {
  success: boolean;
  message: string;
  data:
    | ProductSummary[]
    | {
        items?: ProductSummary[];
        products?: ProductSummary[];
        pagination?: unknown;
      };
};

type ProductDetailEnvelope = {
  success: boolean;
  message: string;
  data:
    | ProductSummary
    | {
        product?: ProductSummary;
      };
};

function unwrapProductList(envelope: ProductListEnvelope): ProductSummary[] {
  if (Array.isArray(envelope.data)) {
    return envelope.data;
  }

  return envelope.data.items ?? envelope.data.products ?? [];
}

function unwrapProduct(envelope: ProductDetailEnvelope) {
  if (
    envelope.data &&
    typeof envelope.data === "object" &&
    "product" in envelope.data &&
    envelope.data.product
  ) {
    return envelope.data.product;
  }

  return envelope.data as ProductSummary;
}

export const productService = {
  async listMyProducts(): Promise<ProductSummary[]> {
    const { data } = await api.get<ProductListEnvelope>("/products", {
      params: {
        page: 1,
        limit: 100,
      },
    });

    return unwrapProductList(data);
  },

  async getMyProductById(id: string): Promise<ProductSummary> {
    const { data } = await api.get<ProductDetailEnvelope>(`/products/${id}`);

    return unwrapProduct(data);
  },

  async createMyProduct(
    payload: CreateProductRequest,
  ): Promise<ProductSummary> {
    const { data } = await api.post<ProductDetailEnvelope>(
      "/products",
      payload,
    );

    return unwrapProduct(data);
  },

  async updateMyProduct(
    id: string,
    payload: UpdateProductRequest,
  ): Promise<ProductSummary> {
    const { data } = await api.put<ProductDetailEnvelope>(
      `/products/${id}`,
      payload,
    );

    return unwrapProduct(data);
  },

  async uploadProductImage(
    productId: string,
    file: File,
    metadata?: {
      altText?: string;
      isMain?: boolean;
      sortOrder?: number;
    },
  ): Promise<ProductSummary> {
    const formData = new FormData();

    formData.append("image", file, file.name);

    if (metadata?.altText) {
      formData.append("altText", metadata.altText);
    }

    if (metadata?.isMain !== undefined) {
      formData.append("isMain", String(metadata.isMain));
    }

    if (metadata?.sortOrder !== undefined) {
      formData.append("sortOrder", String(metadata.sortOrder));
    }

    await api.post(`/products/${productId}/images/upload`, formData);

    const { data } = await api.get<ProductDetailEnvelope>(
      `/products/${productId}`,
    );

    return unwrapProduct(data);
  },

  async deleteProductImage(productId: string, imageId: string): Promise<void> {
    await api.delete(`/products/${productId}/images/${imageId}`);
  },
};
