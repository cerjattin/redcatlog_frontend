import type { PublicBusiness } from "@/features/public/types/publicBusiness.types";
import { normalizeWhatsappNumber } from "@/features/public/utils/whatsapp";
import { buildImageUrl } from "@/utils/image";

export function getPublicBusinessLogoUrl(business: PublicBusiness) {
  return buildImageUrl(business.logoUrl) ?? null;
}

export function getPublicBusinessBannerUrl(business: PublicBusiness) {
  return buildImageUrl(business.bannerUrl ?? business.coverImageUrl) ?? null;
}

export function getPublicBusinessDescription(business: PublicBusiness) {
  return (
    business.shortDescription ||
    business.description ||
    business.story ||
    "Emprendimiento de la Red Mujeres."
  );
}

export function getPublicBusinessCategoryName(business: PublicBusiness) {
  return (
    business.mainCategory?.name || business.category?.name || "Emprendimiento"
  );
}

export function getPublicBusinessLocation(business: PublicBusiness) {
  const city = business.city ?? business.entrepreneur?.city ?? null;
  const department =
    business.department ?? business.entrepreneur?.department ?? null;

  if (city && department) {
    return `${city}, ${department}`;
  }

  return city || department || business.country || null;
}

export function getPublicBusinessWhatsappPhone(business: PublicBusiness) {
  return (
    business.contactWhatsapp ||
    business.whatsapp ||
    business.contactPhone ||
    business.phone ||
    null
  );
}

export function buildPublicBusinessWhatsappUrl(business: PublicBusiness) {
  const phone = getPublicBusinessWhatsappPhone(business);
  const normalizedPhone = normalizeWhatsappNumber(phone);

  if (!normalizedPhone) {
    return null;
  }

  const message = `Hola, vi el emprendimiento "${business.name}" en Red Mujeres y quiero más información.`;

  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
}

export function getPublicBusinessProductsCount(business: PublicBusiness) {
  return (
    business.productsCount ??
    business.productCount ??
    business.products?.length ??
    0
  );
}
