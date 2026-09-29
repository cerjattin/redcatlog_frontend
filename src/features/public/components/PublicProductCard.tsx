import { MessageCircle, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

import { PublicSocialLinks } from "@/features/public/components/PublicSocialLinks";
import type { PublicProduct } from "@/features/public/types/publicProduct.types";
import {
  formatPublicProductPrice,
  getPublicProductEntrepreneurName,
  getPublicProductLocation,
  getPublicProductMainImage,
  getPublicProductWhatsappPhone,
  isPublicProductOutOfStock,
} from "@/features/public/utils/productDisplay";
import { buildWhatsappUrl } from "@/features/public/utils/whatsapp";
import { paths } from "@/routes/paths";

function getPublicProductDetailPath(slug: string) {
  return paths.public.productDetail.replace(":slug", slug);
}

type PublicProductCardProps = {
  product: PublicProduct;
  variant?: "default" | "compact";
};

export function PublicProductCard({
  product,
  variant = "default",
}: PublicProductCardProps) {
  const imageUrl = getPublicProductMainImage(product);
  const price = formatPublicProductPrice(product);
  const entrepreneurName = getPublicProductEntrepreneurName(product);
  const location = getPublicProductLocation(product);
  const whatsappPhone = getPublicProductWhatsappPhone(product);
  const whatsappUrl = buildWhatsappUrl({
    phone: whatsappPhone,
    productName: product.name,
    businessName: entrepreneurName,
  });
  const isOutOfStock = isPublicProductOutOfStock(product);

  if (variant === "compact") {
    return (
      <article className="overflow-hidden rounded-[20px] bg-white shadow-[0_12px_35px_rgba(58,36,103,0.08)]">
        <Link
          to={getPublicProductDetailPath(product.slug)}
          className="group relative block overflow-hidden"
        >
          <img
            src={imageUrl}
            alt={product.images?.[0]?.altText ?? product.name}
            className="h-40 w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          />

          {product.category?.name ? (
            <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-[#3a2467] shadow-sm">
              {product.category.name}
            </span>
          ) : null}

          {isOutOfStock ? (
            <span className="absolute right-3 top-3 rounded-full bg-[#211734] px-3 py-1.5 text-[11px] font-semibold text-white">
              Agotado
            </span>
          ) : null}
        </Link>

        <div className="p-4">
          <Link
            to={getPublicProductDetailPath(product.slug)}
            className="line-clamp-2 text-lg font-bold leading-snug text-[#211734] transition hover:text-[#7b3fe4]"
          >
            {product.name}
          </Link>

          <strong className="mt-2 block text-xl font-semibold text-[#3a2467]">
            {price}
          </strong>

          <div className="mt-4 flex items-center gap-2">
            <Link
              to={getPublicProductDetailPath(product.slug)}
              className="inline-flex flex-1 items-center justify-center rounded-full border border-[#d8cbea] px-3 py-2 text-xs font-bold text-[#6d6383] transition hover:border-[#7b3fe4] hover:text-[#7b3fe4]"
            >
              Ver producto
            </Link>

            {whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Consultar ${product.name} por WhatsApp`}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#35c46a] text-white transition hover:bg-[#2ead5c]"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            ) : null}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="overflow-hidden rounded-[24px] bg-white shadow-[0_18px_50px_rgba(58,36,103,0.08)]">
      <Link
        to={getPublicProductDetailPath(product.slug)}
        className="group relative block overflow-hidden"
      >
        <img
          src={imageUrl}
          alt={product.images?.[0]?.altText ?? product.name}
          className="h-[240px] w-full object-cover transition duration-500 group-hover:scale-[1.03] sm:h-[288px]"
        />

        {product.category?.name ? (
          <span className="absolute left-5 top-5 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-[#3a2467] shadow-sm">
            {product.category.name}
          </span>
        ) : null}

        {isOutOfStock ? (
          <span className="absolute right-5 top-5 rounded-full bg-[#211734] px-4 py-2 text-xs font-semibold text-white shadow-sm">
            Agotado
          </span>
        ) : null}
      </Link>

      <div className="px-6 pb-8 pt-6">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#a0b8fb]/20 px-3 py-2 text-sm text-[#698ae5]">
          <ShoppingCart size={15} />
          Por {entrepreneurName || "REDMUEMMA"}
        </span>

        <strong className="mt-4 block text-[28px] font-semibold leading-none text-[#3a2467]">
          {price}
        </strong>

        <Link
          to={getPublicProductDetailPath(product.slug)}
          className="mt-3 block text-2xl font-bold text-[#211734] transition hover:text-[#7b3fe4]"
        >
          {product.name}
        </Link>

        {product.shortDescription ? (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#6d6383]">
            {product.shortDescription}
          </p>
        ) : null}

        <div className="mt-4 space-y-1 text-sm text-[#8e80aa]">
          <p>Emprendedora: {entrepreneurName}</p>
          {location ? <p>{location}</p> : null}
        </div>

        <PublicSocialLinks
          className="mt-5"
          itemClassName="h-9 min-w-9 px-0 text-[#6d6383]"
          facebookUrl={product.entrepreneur?.facebookUrl}
          instagramUrl={product.entrepreneur?.instagramUrl}
          tiktokUrl={product.entrepreneur?.tiktokUrl}
        />

        {whatsappUrl ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#35c46a] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#2ead5c]"
          >
            <MessageCircle className="h-5 w-5" />
            Consultar por WhatsApp
          </a>
        ) : (
          <div className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#6d6383]/15 px-5 py-3 text-sm font-bold text-[#6d6383]">
            Contacto no disponible
          </div>
        )}
      </div>
    </article>
  );
}

export function PublicProductCardSkeleton({
  variant = "default",
}: {
  variant?: "default" | "compact";
}) {
  if (variant === "compact") {
    return (
      <article className="overflow-hidden rounded-[20px] bg-white">
        <div className="h-40 animate-pulse bg-[#f3edf7]" />
        <div className="space-y-3 p-4">
          <div className="h-5 w-3/4 animate-pulse rounded-lg bg-[#f3edf7]" />
          <div className="h-6 w-1/2 animate-pulse rounded-lg bg-[#f3edf7]" />
          <div className="h-9 w-full animate-pulse rounded-full bg-[#f3edf7]" />
        </div>
      </article>
    );
  }

  return (
    <article className="overflow-hidden rounded-[24px] bg-white">
      <div className="h-[240px] animate-pulse bg-[#f3edf7] sm:h-[288px]" />
      <div className="space-y-4 px-6 pb-8 pt-6">
        <div className="h-9 w-40 animate-pulse rounded-full bg-[#f3edf7]" />
        <div className="h-8 w-28 animate-pulse rounded-xl bg-[#f3edf7]" />
        <div className="h-6 w-52 animate-pulse rounded-xl bg-[#f3edf7]" />
        <div className="h-16 w-full animate-pulse rounded-xl bg-[#f3edf7]" />
        <div className="h-12 w-full animate-pulse rounded-full bg-[#f3edf7]" />
      </div>
    </article>
  );
}
