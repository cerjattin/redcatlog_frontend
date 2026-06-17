import type { PublicProduct } from "@/features/public/types/publicProduct.types";
import { buildImageUrl } from "@/utils/image";

export function getPublicProductMainImage(product: PublicProduct) {
  const imageUrl =
    product.mainImageUrl ||
    product.images?.find((image) => image.isMain)?.imageUrl ||
    product.images?.[0]?.imageUrl ||
    null;

  return buildImageUrl(imageUrl) ?? "/catalog/product-bag.jpg";
}

export function formatPublicProductPrice(product: PublicProduct) {
  if (!product.hasPrice) {
    return "Consultar precio";
  }

  const numericPrice = Number(product.price);

  if (!Number.isFinite(numericPrice)) {
    return "Consultar precio";
  }

  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(numericPrice);
}

export function getPublicProductWhatsappPhone(product: PublicProduct) {
  return (
    product.business?.contactWhatsapp ||
    product.business?.whatsapp ||
    product.business?.contactPhone ||
    product.business?.phone ||
    null
  );
}

export function getPublicProductContactEmail(product: PublicProduct) {
  return product.business?.contactEmail || product.business?.email || null;
}

export function isPublicProductOutOfStock(product: PublicProduct) {
  return product.managesStock === true && Number(product.stock ?? 0) <= 0;
}
