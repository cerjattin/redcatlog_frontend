import {
  ArrowLeft,
  ImageOff,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Tag,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { publicProductService } from "@/features/public/api/publicProduct.service";
import { PublicLayout } from "@/features/public/components/PublicLayout";
import { PublicSocialLinks } from "@/features/public/components/PublicSocialLinks";
import type { PublicProduct } from "@/features/public/types/publicProduct.types";
import {
  formatPublicProductPrice,
  getPublicProductContactEmail,
  getPublicProductEntrepreneurName,
  getPublicProductLocation,
  getPublicProductMainImage,
  getPublicProductWhatsappPhone,
  isPublicProductOutOfStock,
} from "@/features/public/utils/productDisplay";
import { buildWhatsappUrl } from "@/features/public/utils/whatsapp";
import { paths } from "@/routes/paths";
import { buildImageUrl } from "@/utils/image";

function getEntrepreneurDetailPath(product: PublicProduct) {
  const slug = product.entrepreneur?.slug;

  if (!slug) {
    return paths.public.entrepreneurs;
  }

  return paths.public.entrepreneurDetail.replace(":slug", slug);
}

function getCategoryHref(product: PublicProduct) {
  if (!product.categoryId) {
    return paths.public.catalog;
  }

  return `${paths.public.catalog}?categoryId=${product.categoryId}`;
}

export function PublicProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<PublicProduct | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      if (!params.slug) {
        setLoadError("No se encontró el producto solicitado.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setLoadError(null);

        const data = await publicProductService.getProductBySlug(params.slug);

        setProduct(data);
        setSelectedImageUrl(getPublicProductMainImage(data));
      } catch {
        setLoadError("No fue posible cargar el detalle del producto.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadProduct();
  }, [params.slug]);

  const galleryImages = useMemo(() => {
    if (!product) {
      return [];
    }

    const images =
      product.images
        ?.map((image) => ({
          id: image.id,
          url: buildImageUrl(image.imageUrl),
          alt: image.altText ?? product.name,
        }))
        .filter((image): image is { id: string; url: string; alt: string } =>
          Boolean(image.url),
        ) ?? [];

    if (images.length > 0) {
      return images;
    }

    const mainImage = getPublicProductMainImage(product);

    return [
      {
        id: "main",
        url: mainImage,
        alt: product.name,
      },
    ];
  }, [product]);

  if (isLoading) {
    return (
      <PublicLayout active="Catálogo">
        <main className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <div className="h-96 animate-pulse rounded-[2rem] bg-[#f4ecff]" />
        </main>
      </PublicLayout>
    );
  }

  if (loadError || !product) {
    return (
      <PublicLayout active="Catálogo">
        <main className="mx-auto max-w-3xl px-5 py-20 text-center md:px-8">
          <div className="rounded-[2rem] bg-[#fff4f4] p-8">
            <h1 className="text-2xl font-black text-[#211734]">
              Producto no disponible
            </h1>

            <p className="mt-3 text-sm leading-7 text-[#6d6383]">
              {loadError ?? "No encontramos información para este producto."}
            </p>

            <Link
              to={paths.public.catalog}
              className="mt-6 inline-flex rounded-2xl bg-[#7b3fe4] px-5 py-3 text-sm font-bold text-white"
            >
              Volver al catálogo
            </Link>
          </div>
        </main>
      </PublicLayout>
    );
  }

  const entrepreneurName = getPublicProductEntrepreneurName(product);
  const location = getPublicProductLocation(product);
  const whatsappPhone = getPublicProductWhatsappPhone(product);
  const email = getPublicProductContactEmail(product);
  const whatsappUrl = buildWhatsappUrl({
    phone: whatsappPhone,
    productName: product.name,
    businessName: entrepreneurName,
  });
  const isOutOfStock = isPublicProductOutOfStock(product);

  return (
    <PublicLayout active="Catálogo">
      <main className="bg-[#fbf8ff]">
        <section className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-12">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm font-bold text-[#7b3fe4]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </button>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_18px_50px_rgba(58,36,103,0.08)]">
                {selectedImageUrl ? (
                  <img
                    src={selectedImageUrl}
                    alt={product.name}
                    className="h-[420px] w-full object-cover"
                  />
                ) : (
                  <div className="flex h-[420px] items-center justify-center bg-[#f4ecff] text-[#8e80aa]">
                    <ImageOff className="h-10 w-10" />
                  </div>
                )}
              </div>

              {galleryImages.length > 1 ? (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {galleryImages.map((image) => (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => setSelectedImageUrl(image.url)}
                      className="overflow-hidden rounded-2xl border border-[#efe8f8] bg-white"
                    >
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="h-24 w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <article className="rounded-[2rem] bg-white p-6 shadow-[0_18px_50px_rgba(58,36,103,0.08)] md:p-8">
              {product.category?.name ? (
                <Link
                  to={getCategoryHref(product)}
                  className="inline-flex items-center rounded-full bg-[#f4ecff] px-4 py-2 text-xs font-bold text-[#7b3fe4]"
                >
                  <Tag className="mr-2 h-4 w-4" />
                  {product.category.name}
                </Link>
              ) : null}

              <h1 className="mt-5 text-4xl font-black leading-tight text-[#211734] md:text-5xl">
                {product.name}
              </h1>

              <Link
                to={getEntrepreneurDetailPath(product)}
                className="mt-4 inline-flex items-center text-sm font-bold text-[#7b3fe4]"
              >
                <UserRound className="mr-2 h-4 w-4" />
                Por {entrepreneurName}
              </Link>

              {location ? (
                <p className="mt-3 flex items-center text-sm text-[#6d6383]">
                  <MapPin className="mr-2 h-4 w-4 text-[#ff9f82]" />
                  {location}
                </p>
              ) : null}

              <div className="mt-6 rounded-3xl bg-[#fbf8ff] p-5">
                <p className="text-sm font-medium text-[#6d6383]">Precio</p>

                <strong className="mt-1 block text-3xl font-black text-[#211734]">
                  {formatPublicProductPrice(product)}
                </strong>

                <p className="mt-3 flex items-center text-sm text-[#6d6383]">
                  <Package className="mr-2 h-4 w-4 text-[#ff9f82]" />
                  {product.managesStock
                    ? isOutOfStock
                      ? "Producto agotado"
                      : `${product.stock ?? 0} unidades disponibles`
                    : "Disponibilidad por consulta"}
                </p>
              </div>

              <p className="mt-6 text-sm leading-7 text-[#6d6383]">
                {product.description ||
                  product.shortDescription ||
                  "Producto publicado en REDMUEMMA."}
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {whatsappUrl ? (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-2xl bg-[#25d366] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1db954]"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Consultar por WhatsApp
                  </a>
                ) : null}

                {email ? (
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex items-center justify-center rounded-2xl border border-[#ded4ef] bg-white px-5 py-3 text-sm font-bold text-[#35264d] transition hover:border-[#c7b4e8]"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Enviar correo
                  </a>
                ) : null}

                {whatsappPhone && !whatsappUrl ? (
                  <div className="inline-flex items-center justify-center rounded-2xl border border-[#ded4ef] bg-white px-5 py-3 text-sm font-bold text-[#35264d]">
                    <Phone className="mr-2 h-4 w-4" />
                    {whatsappPhone}
                  </div>
                ) : null}
              </div>

              <PublicSocialLinks
                className="mt-6"
                facebookUrl={product.entrepreneur?.facebookUrl}
                instagramUrl={product.entrepreneur?.instagramUrl}
                tiktokUrl={product.entrepreneur?.tiktokUrl}
              />
            </article>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
