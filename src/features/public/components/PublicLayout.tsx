import { ChevronDown, Menu, UserRound, X } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { PublicSocialLinks } from "@/features/public/components/PublicSocialLinks";
import { paths } from "@/routes/paths";

const navItems = [
  { label: "Inicio", href: paths.public.home },
  {
    label: "Sobre nosotros",
    href: paths.public.about,
    dropdown: true,
  },
  { label: "Emprendedoras", href: paths.public.entrepreneurs, dropdown: true },
  { label: "Catálogo", href: paths.public.catalog, dropdown: true },
  { label: "Galería", href: paths.public.gallery, dropdown: true },
  { label: "Contacto", href: paths.public.contact },
];

const brandName = "RED MUEMMA Mujeres Emprendedoras de los Montes de Maria";

export function Instagram({ size = 20 }: { size?: number }) {
  return (
    <span style={{ fontSize: size }} aria-hidden="true">
      ◎
    </span>
  );
}

export function BrandLogo({
  variant = "purple",
}: {
  variant?: "purple" | "pink";
}) {
  const isFooter = variant === "pink";
  const iconSize = isFooter ? "h-[58px] w-[58px]" : "h-[50px] w-[50px]";
  const titleSize = isFooter
    ? "text-[28px] md:text-[34px]"
    : "text-[24px] md:text-[31px]";
  const taglineSize = isFooter
    ? "text-[10px] md:text-xs"
    : "text-[8px] md:text-[10px]";

  return (
    <span className="inline-flex flex-col" aria-label={brandName}>
      <span className="flex items-center gap-2">
        <img src="/favicon.svg" alt="" className={`${iconSize} shrink-0`} />
        <span
          className={`font-bold uppercase leading-[0.95] tracking-[-0.04em] ${titleSize}`}
        >
          <span className="block text-[#3a2467]">RED</span>
          <span className="block text-[#ff88ac]">MUEMMA</span>
        </span>
      </span>
      <span
        className={`mt-1 block text-center font-semibold uppercase leading-tight tracking-[0.02em] text-[#3a2467] ${taglineSize}`}
      >
        Mujeres Emprendedoras de los Montes de Maria
      </span>
    </span>
  );
}

export function PublicHeader({ active = "Inicio" }: { active?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/45 bg-white/55 shadow-[0_10px_30px_rgba(58,36,103,0.08)] backdrop-blur-xl">
      <div className="mx-auto flex h-[104px] max-w-[1224px] items-center justify-between px-5 lg:px-0">
        <Link to={paths.public.home} aria-label={brandName}>
          <BrandLogo />
        </Link>
        <nav
          className="hidden items-center gap-8 lg:flex"
          aria-label="Navegación principal"
        >
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={`flex items-center gap-1 text-sm transition hover:text-[#d66eff] ${item.label === active ? "font-semibold text-[#d66eff]" : "text-[#211734]"}`}
            >
              {item.label}
              {item.dropdown && <ChevronDown size={14} />}
            </Link>
          ))}
        </nav>
        <Link
          to={paths.public.login}
          className="hidden items-center gap-2 rounded-full border border-[#8e80aa] px-6 py-3 text-sm font-semibold text-[#3a2467] transition hover:bg-[#f7edff] lg:flex"
        >
          Iniciar sesión <UserRound size={18} />
        </Link>
        <button
          className="rounded-full p-2 text-[#3a2467] lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Abrir menú"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="border-t border-white/50 bg-white/80 px-5 py-5 shadow-[0_18px_40px_rgba(58,36,103,0.12)] backdrop-blur-xl lg:hidden">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              onClick={() => setOpen(false)}
              className="block py-3 font-medium text-[#3a2467]"
            >
              {item.label}
            </Link>
          ))}
          <Link
            to={paths.public.login}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-[#3a2467] px-5 py-3 font-semibold text-white"
          >
            Iniciar sesión <UserRound size={18} />
          </Link>
        </nav>
      )}
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer id="contacto" className="bg-white pt-16">
      <div className="mx-auto grid max-w-[1224px] gap-12 px-5 pb-12 md:grid-cols-[1.2fr_2fr] lg:px-0">
        <div>
          <BrandLogo variant="pink" />
          <p className="mt-6 max-w-[300px] text-lg leading-snug text-[#3a2467]">
            Transformando historias de vida en{" "}
            <strong>oportunidades de crecimiento y éxito.</strong>
          </p>
          <PublicSocialLinks
            className="mt-6"
            itemClassName="border-0 bg-[#d66eff]/20 text-[#7044c9]"
          />
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <FooterLinks
            title="Enlaces"
            items={[
              "Inicio",
              "Sobre nosotros",
              "Emprendedoras",
              "Catálogo",
              "Galería",
            ]}
          />
          <FooterLinks
            title="Categorías"
            items={["Artesanías", "Gastronomía", "Belleza", "Moda"]}
          />
          <FooterLinks
            title="Contacto"
            items={["info@mujeresemprendedoras", "+57 300 000 0000"]}
          />
        </div>
      </div>
      <div className="mx-auto max-w-[1224px] border-t border-[#eee7f3] px-5 py-6 text-sm text-[#6d6383] lg:px-0">
        © 2026 Mujeres Emprendedoras. Todos los derechos reservados.
      </div>
    </footer>
  );
}

function FooterLinks({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="font-semibold text-[#d66eff]">{title}</h3>
      <ul className="mt-3 space-y-3 text-sm text-[#3a2467]">
        {items.map((item) => (
          <li key={item}>
            <a href="#inicio" className="hover:text-[#d94673]">
              {item}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PublicLayout({
  active = "Inicio",
  children,
}: {
  active?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-[#211734]">
      <PublicHeader active={active} />
      {children}
      <PublicFooter />
    </div>
  );
}
