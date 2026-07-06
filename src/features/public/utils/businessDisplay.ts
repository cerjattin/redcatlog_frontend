import type { PublicBusiness } from "@/features/public/types/publicBusiness.types";
import { normalizeWhatsappNumber } from "@/features/public/utils/whatsapp";
import { buildImageUrl } from "@/utils/image";

export function getPublicBusinessLogoUrl(entrepreneur: PublicBusiness) {
  return (
    buildImageUrl(entrepreneur.photoUrl ?? entrepreneur.profilePhotoUrl) ?? null
  );
}

export function getPublicBusinessBannerUrl(entrepreneur: PublicBusiness) {
  return buildImageUrl(entrepreneur.bannerUrl) ?? null;
}

export function getPublicBusinessName(entrepreneur: PublicBusiness) {
  const fullName = entrepreneur.fullName?.trim();

  if (fullName) {
    return fullName;
  }

  const firstName = entrepreneur.firstName?.trim() ?? "";
  const lastName = entrepreneur.lastName?.trim() ?? "";
  const name = `${firstName} ${lastName}`.trim();

  return name || `Emprendedora #${entrepreneur.id}`;
}

export function getPublicBusinessDescription(entrepreneur: PublicBusiness) {
  return (
    entrepreneur.shortBio ||
    entrepreneur.bio ||
    entrepreneur.personalStory ||
    entrepreneur.description ||
    "Emprendedora de la red REDMUEMMA."
  );
}

export function getPublicBusinessCategoryName(entrepreneur: PublicBusiness) {
  return entrepreneur.category?.name || "Emprendedora";
}

export function getPublicBusinessLocation(entrepreneur: PublicBusiness) {
  const city = entrepreneur.city ?? null;
  const department = entrepreneur.department ?? null;

  if (city && department) {
    return `${city}, ${department}`;
  }

  return (
    city ||
    department ||
    entrepreneur.locationText ||
    entrepreneur.country ||
    null
  );
}

export function getPublicBusinessWhatsappPhone(entrepreneur: PublicBusiness) {
  return entrepreneur.whatsapp || entrepreneur.phone || null;
}

export function buildPublicBusinessWhatsappUrl(entrepreneur: PublicBusiness) {
  const phone = getPublicBusinessWhatsappPhone(entrepreneur);
  const normalizedPhone = normalizeWhatsappNumber(phone);

  if (!normalizedPhone) {
    return null;
  }

  const name = getPublicBusinessName(entrepreneur);
  const message = `Hola, vi el perfil de ${name} en REDMUEMMA y quiero más información.`;

  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
}

export function getPublicBusinessProductsCount(entrepreneur: PublicBusiness) {
  return (
    entrepreneur.productsCount ??
    entrepreneur.productCount ??
    entrepreneur.products?.length ??
    0
  );
}
