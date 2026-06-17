type BuildWhatsappUrlParams = {
  phone?: string | null;
  productName: string;
  businessName?: string | null;
};

export function normalizeWhatsappNumber(phone?: string | null) {
  if (!phone) {
    return null;
  }

  let digits = phone.replace(/\D/g, "");

  if (!digits) {
    return null;
  }

  if (digits.startsWith("00")) {
    digits = digits.slice(2);
  }

  if (digits.startsWith("57")) {
    return digits;
  }

  if (digits.length === 10 && digits.startsWith("3")) {
    return `57${digits}`;
  }

  return digits;
}

export function buildWhatsappUrl({
  phone,
  productName,
  businessName,
}: BuildWhatsappUrlParams) {
  const normalizedPhone = normalizeWhatsappNumber(phone);

  if (!normalizedPhone) {
    return null;
  }

  const message = businessName
    ? `Hola, vi este producto en Red Mujeres y quiero más información: ${productName} de ${businessName}.`
    : `Hola, vi este producto en Red Mujeres y quiero más información: ${productName}.`;

  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
}
