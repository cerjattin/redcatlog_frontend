import {
  ArrowRight,
  ChevronDown,
  Heart,
  Lightbulb,
  MapPin,
  Menu,
  Package,
  ShoppingBag,
  Sparkles,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { paths } from "@/routes/paths";

const navItems = [
  { label: "Inicio", href: paths.public.home },
  {
    label: "Sobre nosotros",
    href: `${paths.public.home}#historia`,
    dropdown: true,
  },
  { label: "Emprendedoras", href: paths.public.entrepreneurs, dropdown: true },
  { label: "Catálogo", href: paths.public.catalog, dropdown: true },
  { label: "Galería", href: paths.public.gallery, dropdown: true },
  { label: "Contacto", href: `${paths.public.home}#contacto` },
];

const categories = [
  {
    title: "Artesanías",
    subtitle: "Piezas hechas a mano",
    image: "/home/product-1.jpg",
  },
  {
    title: "Gastronomía",
    subtitle: "Sabores tradicionales",
    image: "/home/product-2.jpg",
  },
  {
    title: "Belleza",
    subtitle: "Productos naturales",
    image: "/home/product-3.jpg",
  },
  { title: "Moda", subtitle: "Diseños únicos", image: "/home/product-4.jpg" },
];

const entrepreneurs = [
  {
    category: "Artesanías",
    city: "Bogotá",
    name: "Hilos de esperanza",
    detail: "Tejidos tradicionales con alma",
    image: "/home/entrepreneur-1.jpg",
  },
  {
    category: "Gastronomía",
    city: "Medellín",
    name: "Raíces Creativas",
    detail: "Sabores que cuentan historias",
    image: "/home/entrepreneur-2.jpg",
  },
  {
    category: "Belleza",
    city: "Cali",
    name: "Esencia Natural",
    detail: "Belleza hecha con amor",
    image: "/home/entrepreneur-3.jpg",
  },
];

const products = [
  {
    brand: "Joyas del corazón",
    name: "Collar Artesanal",
    price: "$45.000",
    image: "/home/category-crafts.jpg",
  },
  {
    brand: "Raíces creativas",
    name: "Bolso Tejido",
    price: "$85.000",
    image: "/home/category-food.jpg",
  },
  {
    brand: "Colores del alma",
    name: "Pulseras Coloridas",
    price: "$25.000",
    image: "/home/category-beauty.jpg",
  },
  {
    brand: "Tejiendo Sueños",
    name: "Textil Tradicional",
    price: "$120.000",
    image: "/home/category-fashion.jpg",
  },
];

function Instagram({ size = 20 }: { size?: number }) {
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
  const logoFile = variant === "purple" ? "logo-pink.svg" : "logo-purple.svg";
  return (
    <img
      src={`/home/${logoFile}`}
      alt="Red-Muemma"
      className="h-[36px] w-[152px]"
    />
  );
}

export function PublicHeader({ active = "Inicio" }: { active?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-[#fff9fb]/95 backdrop-blur">
      <div className="mx-auto flex h-[104px] max-w-[1224px] items-center justify-between px-5 lg:px-0">
        <Link to={paths.public.home} aria-label="Ir al inicio">
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
        <nav className="border-t border-[#eadff2] bg-white px-5 py-5 lg:hidden">
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

function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-11 text-center">
      <h2 className="text-3xl font-bold leading-tight text-[#211734] md:text-[40px]">
        {title}
      </h2>
      <p className="mt-3 text-base text-[#6d6383] md:text-xl">{subtitle}</p>
    </div>
  );
}

function PillButton({
  children,
  light = false,
}: {
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <Button
      className={`h-auto rounded-full px-6 py-3.5 text-sm shadow-[0_10px_20px_rgba(58,36,103,.14)] ${light ? "bg-white text-[#7044c9] hover:bg-[#faf7ff]" : "bg-[#211734] text-white hover:bg-[#3a2467]"}`}
    >
      {children}
      <ArrowRight size={17} className="ml-2" />
    </Button>
  );
}

function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-[linear-gradient(115deg,#fff5f6_0%,#fff_48%,#f4e9ff_100%)]"
    >
      <div className="mx-auto grid min-h-[796px] max-w-[1224px] items-center gap-10 px-5 py-16 lg:grid-cols-[.92fr_1.08fr] lg:px-0 lg:py-12">
        <div className="relative z-10">
          <h1 className="max-w-[620px] text-[46px] font-bold leading-[.98] tracking-[-.03em] text-[#3a2467] sm:text-6xl lg:text-[72px]">
            Transformando historias en{" "}
            <span className="text-[#d94673]">oportunidades</span>
          </h1>
          <p className="mt-8 max-w-[560px] text-lg leading-[1.45] text-[#6d6383] md:text-xl">
            Descubre emprendimientos únicos creados por mujeres extraordinarias.
            Cada producto cuenta una historia de resiliencia, creatividad y
            esperanza.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <PillButton>
              Explorar catálogo <ShoppingBag size={17} className="ml-2" />
            </PillButton>
            <a
              href="#historia"
              className="inline-flex items-center rounded-full border border-[#b9aec9] bg-white px-6 py-3.5 text-sm font-semibold text-[#3a2467] shadow-sm"
            >
              Conocer historias
            </a>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[650px]">
          <div className="absolute right-0 top-[22%] h-20 w-20 rounded-[28px] bg-[#ff7da5] opacity-90" />
          <img
            src="/home/hero.png"
            alt="Emprendedora sonriendo"
            className="relative z-10 w-full"
          />
          <div className="absolute bottom-[8%] left-[2%] z-20 rounded-3xl bg-[#d66eff] p-5 text-white shadow-xl">
            <div className="flex items-center gap-2 text-lg font-bold">
              <ShoppingBag size={22} /> Apoya
              <br />
              marcas locales
            </div>
            <div className="mt-3 rounded-full bg-white/25 px-3 py-1 text-xs">
              Hecho 100% colombiano
            </div>
          </div>
          <div className="absolute right-0 top-[43%] z-20 rounded-2xl bg-[#ff9a82] px-4 py-3 text-sm font-bold leading-none text-[#3a2467] shadow-lg">
            Llenas de
            <br />
            creatividad
            <br />y cultura
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 flex items-end gap-3 opacity-80">
        <span className="h-14 w-14 rounded-full bg-[#94aefa]" />
        <span className="h-16 w-20 bg-[#ff9e83]" />
        <span className="h-20 w-20 bg-[#d66eff] [clip-path:polygon(0_0,100%_100%,0_100%)]" />
      </div>
    </section>
  );
}

function Impact() {
  const stats = [
    { value: "250+", label: "Mujeres emprendedoras", icon: <UsersRound /> },
    { value: "1200+", label: "Productos únicos", icon: <Package /> },
    { value: "180", label: "Emprendimientos", icon: <Heart /> },
    { value: "15+", label: "Ciudades", icon: <MapPin /> },
  ];
  return (
    <section className="relative bg-[#fff0f3] py-14">
      <div className="mx-auto grid max-w-[1224px] gap-10 px-5 lg:grid-cols-[1fr_1.6fr] lg:px-0">
        <div>
          <h2 className="text-3xl font-bold leading-tight text-[#211734]">
            Emprendimientos que están
            <br className="hidden sm:block" /> causando un impacto
          </h2>
          <p className="mt-3 text-lg text-[#6d6383]">
            Gracias a tu apoyo y la creatividad
            <br className="hidden sm:block" /> de las mujeres emprendedoras de
            esta red.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-7 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#d94673]">
                {stat.icon}
              </span>
              <strong className="mt-3 block text-3xl text-[#211734]">
                {stat.value}
              </strong>
              <span className="text-xs text-[#6d6383]">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Categories() {
  return (
    <section
      id="categorias"
      className="relative overflow-hidden bg-[#fff8f5] py-20 md:py-24"
    >
      <div className="mx-auto max-w-[1224px] px-5 lg:px-0">
        <SectionHeading
          title="Explora por Categorías"
          subtitle="Descubre la diversidad de talento y creatividad en cada categoría"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <a
              key={category.title}
              href="#productos"
              className="group relative h-[430px] overflow-hidden rounded-[28px] shadow-[0_16px_30px_rgba(58,36,103,.18)]"
            >
              <img
                src={category.image}
                alt=""
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3a2467]/90 via-transparent to-transparent" />
              <div className="absolute bottom-0 p-6 text-white">
                <h3 className="text-2xl font-bold">{category.title}</h3>
                <p className="mt-1">{category.subtitle}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Entrepreneurs() {
  return (
    <section id="emprendedoras" className="bg-[#fff4ef] py-20 md:py-24">
      <div className="mx-auto max-w-[1224px] px-5 lg:px-0">
        <SectionHeading
          title="Emprendedoras Destacadas"
          subtitle="Conoce las marcas que están transformando vidas a través de su trabajo"
        />
        <div className="grid gap-6 md:grid-cols-3">
          {entrepreneurs.map((person) => (
            <Card
              key={person.name}
              className="overflow-hidden rounded-[28px] border-0 p-0 shadow-none"
            >
              <img
                src={person.image}
                alt=""
                className="h-[290px] w-full object-cover"
              />
              <div className="p-6">
                <div className="flex gap-3 text-xs">
                  <span className="rounded-full bg-[#ffe6ec] px-3 py-1 text-[#d94673]">
                    {person.category}
                  </span>
                  <span className="flex items-center gap-1 text-[#8e80aa]">
                    <MapPin size={12} /> {person.city}
                  </span>
                </div>
                <h3 className="mt-4 text-2xl font-bold text-[#3a2467]">
                  {person.name}
                </h3>
                <p className="mt-1 text-sm text-[#6d6383]">{person.detail}</p>
                <a
                  href="#historia"
                  className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-[#3a2467]"
                >
                  Ver perfil <ArrowRight size={15} />
                </a>
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-12 text-center">
          <PillButton>Conoce todas las emprendedoras</PillButton>
        </div>
      </div>
    </section>
  );
}

function Products() {
  return (
    <section id="productos" className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-[1224px] px-5 lg:px-0">
        <SectionHeading
          title="Productos Destacados"
          subtitle="Cada pieza es única y lleva consigo una historia de superación"
        />
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {products.map((product) => (
            <article
              key={product.name}
              className="overflow-hidden rounded-[24px] bg-[#fffafb] shadow-[0_10px_24px_rgba(58,36,103,.08)]"
            >
              <img
                src={product.image}
                alt=""
                className="h-52 w-full object-cover sm:h-72"
              />
              <div className="p-4">
                <p className="text-xs text-[#8e80aa]">🛍 Por {product.brand}</p>
                <strong className="mt-3 block text-xl text-[#7044c9]">
                  {product.price}
                </strong>
                <p className="mt-1 text-sm text-[#6d6383]">{product.name}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-12 text-center">
          <PillButton>Explora todos los productos</PillButton>
        </div>
      </div>
    </section>
  );
}

function Story() {
  return (
    <section
      id="historia"
      className="relative overflow-hidden bg-[#3a2467] py-20 text-white md:py-24"
    >
      <div className="mx-auto grid max-w-[1224px] items-center gap-14 px-5 lg:grid-cols-2 lg:px-0">
        <div>
          <img
            src="/home/story.jpg"
            alt="Mujeres emprendedoras"
            className="h-[430px] w-full rounded-[28px] object-cover object-[35%_center]"
          />
          <div className="mt-5 flex items-center gap-5 rounded-[22px] bg-[#ff9f82] px-7 py-4 text-[#211734]">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#9fb7ff]">
              <Lightbulb size={30} />
            </span>
            <strong className="text-2xl">
              Pasión y<br />
              creatividad
            </strong>
            <Sparkles className="ml-auto text-[#d66eff]" size={38} />
          </div>
        </div>
        <div>
          <h2 className="text-4xl font-bold leading-tight md:text-5xl">
            Cada compra es un acto de{" "}
            <span className="text-[#ff9f82]">empoderamiento</span>
          </h2>
          <p className="mt-7 text-lg leading-relaxed text-white/90">
            Al apoyar estos emprendimientos, no solo adquieres productos únicos
            y de calidad, sino que también contribuyes a la transformación de
            vidas y comunidades enteras.
          </p>
          <p className="mt-5 text-lg leading-relaxed text-white/90">
            Cada artículo representa horas de dedicación, talento y la valentía
            de mujeres que han decidido escribir un nuevo capítulo en sus
            historias.
          </p>
          <div className="mt-8">
            <PillButton light>Conoce nuestra historia</PillButton>
          </div>
        </div>
      </div>
    </section>
  );
}

function CallToAction() {
  return (
    <section className="bg-[linear-gradient(110deg,#ffe3e3,#fff,#f2e3ff)] px-5 py-20 md:py-24">
      <div className="relative mx-auto grid max-w-[1224px] overflow-hidden rounded-[34px] bg-[#9fb7ff] shadow-[0_18px_40px_rgba(58,36,103,.16)] lg:grid-cols-[.9fr_1.1fr]">
        <img
          src="/home/cta.png"
          alt="Red de mujeres emprendedoras"
          className="h-full min-h-[330px] w-full object-cover"
        />
        <div className="relative flex flex-col justify-center p-8 text-white md:p-12">
          <h2 className="text-3xl font-bold leading-tight md:text-[40px]">
            Una red de mujeres que ya está transformando vidas
          </h2>
          <p className="mt-5 text-lg leading-relaxed">
            Estos emprendimientos no son sólo negocios, son evidencia de que el
            talento y la determinación no tienen límites. Al apoyarlos, eres
            parte de algo más grande.
          </p>
          <div className="mt-7">
            <PillButton light>Ver catálogo</PillButton>
          </div>
          <div className="absolute bottom-0 right-0 flex items-end gap-2">
            <span className="h-14 w-8 rounded-t-full bg-[#ff7da5]" />
            <span className="h-14 w-16 bg-[#ff9f82]" />
            <span className="h-14 w-16 bg-[#d66eff] [clip-path:polygon(0_0,100%_100%,0_100%)]" />
          </div>
        </div>
      </div>
    </section>
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
          <div className="mt-6 flex gap-3">
            <a
              href="#"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d66eff]/20 text-[#7044c9]"
            >
              <Instagram size={20} />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d66eff]/20 font-bold text-[#7044c9]"
            >
              f
            </a>
          </div>
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

export function HomePage() {
  return (
    <div className="overflow-hidden bg-white text-[#211734]">
      <PublicHeader />
      <main>
        <Hero />
        <Impact />
        <Categories />
        <Entrepreneurs />
        <Products />
        <Story />
        <CallToAction />
      </main>
      <PublicFooter />
    </div>
  );
}
