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

export function getPublicProductEntrepreneurName(product: PublicProduct) {
  const entrepreneur = product.entrepreneur;

  if (!entrepreneur) {
    return product.business?.name ?? "REDMUEMMA";
  }

  const fullName = entrepreneur.fullName?.trim();

  if (fullName) {
    return fullName;
  }

  const firstName = entrepreneur.firstName?.trim() ?? "";
  const lastName = entrepreneur.lastName?.trim() ?? "";
  const name = `${firstName} ${lastName}`.trim();

  return name || `Emprendedora #${entrepreneur.id}`;
}

export function getPublicProductWhatsappPhone(product: PublicProduct) {
  return (
    product.entrepreneur?.whatsapp ||
    product.entrepreneur?.phone ||
    product.business?.contactWhatsapp ||
    product.business?.whatsapp ||
    product.business?.contactPhone ||
    product.business?.phone ||
    null
  );
}

export function getPublicProductContactEmail(product: PublicProduct) {
  return (
    product.entrepreneur?.email ||
    product.business?.contactEmail ||
    product.business?.email ||
    null
  );
}

export function getPublicProductLocation(product: PublicProduct) {
  const city = product.entrepreneur?.city;
  const department = product.entrepreneur?.department;
  const country = product.entrepreneur?.country;

  if (city && department) {
    return `${city}, ${department}`;
  }

  return city || department || country || null;
}

export function isPublicProductOutOfStock(product: PublicProduct) {
  return product.managesStock === true && Number(product.stock ?? 0) <= 0;
}
