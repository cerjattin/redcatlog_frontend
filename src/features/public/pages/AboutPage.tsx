import {
  HandHeart,
  Heart,
  MapPin,
  Package,
  Sparkles,
  Target,
  UsersRound,
} from "lucide-react";

import { PublicFooter, PublicHeader } from "@/features/public/components/PublicLayout";

const values = [
  {
    title: "Empoderamiento",
    description:
      "Creemos en el poder transformador del emprendimiento como herramienta de desarrollo personal y comunitario.",
    icon: HandHeart,
    color: "text-[#d94673]",
    bg: "bg-[#ff88ac]/10",
  },
  {
    title: "Oportunidad",
    description:
      "Creamos espacios donde cada mujer puede mostrar su talento y construir un futuro próspero.",
    icon: Target,
    color: "text-[#7044c9]",
    bg: "bg-[#a0b8fb]/10",
  },
  {
    title: "Comunidad",
    description:
      "Construimos una red de apoyo mutuo donde las emprendedoras crecen juntas.",
    icon: UsersRound,
    color: "text-[#fb7d58]",
    bg: "bg-[#fbab8e]/10",
  },
  {
    title: "Excelencia",
    description:
      "Promovemos la calidad y autenticidad en cada producto y servicio ofrecido.",
    icon: Sparkles,
    color: "text-[#d66eff]",
    bg: "bg-[#d66eff]/10",
  },
] as const;

const impactStats = [
  {
    value: "250+",
    label: "Mujeres emprendedoras",
    icon: UsersRound,
    bg: "bg-[#ff88ac]",
  },
  {
    value: "1200+",
    label: "Productos únicos",
    icon: Package,
    bg: "bg-[#a0b8fb]",
  },
  {
    value: "180",
    label: "Emprendimientos",
    icon: Heart,
    bg: "bg-[#fbab8e]",
  },
  {
    value: "15+",
    label: "Ciudades",
    icon: MapPin,
    bg: "bg-[#d66eff]",
  },
] as const;

function HeroAbout() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_0%_5%,#ffe3e3_0%,#fffcfc_50%,#f2e3ff_100%)] px-5 py-24 text-center md:py-[168px]">
      <div className="pointer-events-none absolute bottom-0 right-0 hidden h-[100px] w-[271px] items-end justify-end gap-0 md:flex">
        <span className="h-[100px] w-[68px] rounded-l-full bg-[#a0b8fb]" />
        <span className="h-[100px] w-[100px] bg-[#fbab8e]" />
        <span className="h-[100px] w-[100px] bg-[#d66eff] [clip-path:polygon(0_0,100%_100%,0_100%)]" />
      </div>
      <div className="pointer-events-none absolute left-[-95px] top-[290px] hidden h-[220px] w-[220px] rounded-full border-[24px] border-[#d66eff]/35 md:block" />

      <div className="relative z-10 mx-auto max-w-[656px]">
        <h1 className="text-4xl font-black leading-none text-[#3a2467] md:text-[56px]">
          Nuestra historia
        </h1>
        <p className="mt-4 text-lg leading-[1.35] text-[#6d6383] md:text-2xl">
          Descubre emprendimientos únicos creados por mujeres extraordinarias.
          Cada producto cuenta una historia de resiliencia, creatividad y
          esperanza.
        </p>
      </div>
    </section>
  );
}

function WhoWeAre() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(82deg,#ffe9f0_4%,#fff_100%)] px-5 py-16 md:py-[72px]">
      <div className="pointer-events-none absolute left-[-36px] top-0 h-24 w-24 rounded-full bg-[#f1d6ee]" />
      <div className="pointer-events-none absolute right-[-50px] top-[88%] h-24 w-24 rounded-full bg-[#d66eff]" />

      <div className="relative z-10 mx-auto grid max-w-[1224px] items-center gap-8 md:grid-cols-[392px_1fr] md:gap-12">
        <div className="h-[360px] overflow-hidden rounded-[24px] shadow-[0_24px_25px_rgba(13,33,91,0.25)] md:h-[432px]">
          <img
            src="/about/about-who.jpg"
            alt="Manos tejiendo una pieza artesanal"
            className="h-full w-full object-cover"
          />
          <div className="pointer-events-none -mt-40 h-40 bg-gradient-to-t from-[#7044c9]/55 to-transparent" />
        </div>

        <div>
          <h2 className="text-[28px] font-bold leading-[1.1] text-[#211734] md:text-[32px]">
            ¿Quiénes Somos?
          </h2>
          <div className="mt-6 space-y-6 text-lg leading-[1.35] text-[#6d6383] md:text-2xl">
            <p>
              Somos una red de mujeres emprendedoras que han decidido escribir
              un nuevo capítulo en sus vidas. A través de sus marcas y negocios,
              demuestran que el talento, la dedicación y el apoyo mutuo pueden
              transformar cualquier realidad.
            </p>
            <p>
              Esta plataforma nace con el propósito de visibilizar el trabajo de
              mujeres extraordinarias que, a pesar de los desafíos, han
              encontrado en el emprendimiento una oportunidad para construir un
              futuro mejor para ellas y sus familias.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ValuesSection() {
  return (
    <section className="relative overflow-hidden bg-[#fff4f0] px-5 py-[72px]">
      <div className="pointer-events-none absolute bottom-0 left-0 hidden items-end md:flex">
        <span className="h-[104px] w-[104px] rounded-full bg-[#ffd5c9]" />
        <span className="h-[104px] w-[104px] bg-[#ffd5c9] [clip-path:polygon(0_0,100%_100%,0_100%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1016px] text-center">
        <h2 className="text-[28px] font-bold leading-[1.1] text-[#211734] md:text-[32px]">
          Nuestros Valores
        </h2>
        <p className="mt-3 text-lg leading-[1.35] text-[#6d6383] md:text-2xl">
          Los principios que guían nuestro trabajo y compromiso
        </p>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => {
            const Icon = value.icon;

            return (
              <article key={value.title} className="flex flex-col items-center">
                <span
                  className={`flex h-16 w-16 items-center justify-center rounded-full ${value.bg} ${value.color}`}
                >
                  <Icon size={28} strokeWidth={1.8} />
                </span>
                <h3 className="mt-3 text-xl font-semibold leading-none text-[#211734]">
                  {value.title}
                </h3>
                <p className="mt-3 text-sm leading-[1.15] text-[#6d6383]">
                  {value.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MissionVision() {
  return (
    <section className="relative overflow-hidden bg-[#7044c9] px-5 py-20 text-white">
      <div className="pointer-events-none absolute left-[-150px] top-[140px] h-[320px] w-[320px] rounded-full border-[34px] border-white/15" />
      <div className="pointer-events-none absolute bottom-0 left-[-160px] h-[330px] w-[330px] rounded-full bg-white/10" />
      <div className="pointer-events-none absolute bottom-0 right-0 hidden items-end md:flex">
        <span className="h-[96px] w-[96px] rounded-full bg-[#d66eff]" />
        <span className="h-[96px] w-[96px] bg-[#d66eff] [clip-path:polygon(0_0,100%_100%,0_100%)]" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-[1224px] gap-16">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-[72px]">
          <ImageCard src="/about/mission-table.jpg" alt="Mujeres trabajando en un taller artesanal" />
          <div>
            <h2 className="text-[34px] font-bold leading-[1.1] text-[#fbab8e] md:text-[40px]">
              Nuestra Misión
            </h2>
            <div className="mt-8 space-y-6 text-xl leading-[1.35] md:text-2xl">
              <p>
                Empoderar a mujeres emprendedoras brindándoles una plataforma
                para visibilizar sus productos y servicios, conectándolas con
                clientes que valoran el trabajo artesanal, la calidad y el
                impacto social positivo.
              </p>
              <p>
                Creamos oportunidades económicas sostenibles que permiten a las
                emprendedoras construir vidas dignas y prósperas para ellas y
                sus familias.
              </p>
            </div>
          </div>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-[72px]">
          <div className="lg:order-1">
            <h2 className="text-[34px] font-bold leading-[1.1] text-[#d66eff] md:text-[40px]">
              Nuestra Visión
            </h2>
            <div className="mt-8 space-y-6 text-xl leading-[1.35] md:text-2xl">
              <p>
                Ser la red de emprendedoras más reconocida de Colombia, donde
                cada mujer encuentre el apoyo, las herramientas y las
                oportunidades necesarias para hacer crecer su negocio y alcanzar
                su máximo potencial.
              </p>
              <p>
                Aspiramos a crear un ecosistema donde el emprendimiento femenino
                sea celebrado, valorado y apoyado por toda la sociedad.
              </p>
            </div>
          </div>
          <ImageCard
            src="/about/vision.jpg"
            alt="Mujeres trabajando piezas de cerámica"
            className="lg:order-2"
          />
        </div>
      </div>
    </section>
  );
}

function ImageCard({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={`relative h-[330px] overflow-hidden rounded-[24px] md:h-[396px] ${className}`}>
      <img src={src} alt={alt} className="h-full w-full object-cover" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#ff88ac]/55 to-transparent" />
    </div>
  );
}

function ImpactSection() {
  return (
    <section className="relative overflow-hidden bg-[#3a2467] px-5 py-[72px] text-center">
      <div className="pointer-events-none absolute left-0 top-0 hidden items-start md:flex">
        <span className="h-[99px] w-[99px] rounded-full bg-[#a0b8fb]" />
        <span className="h-[99px] w-[99px] bg-[#a0b8fb] [clip-path:polygon(0_0,100%_100%,0_100%)]" />
      </div>
      <div className="pointer-events-none absolute bottom-0 right-[-48px] h-[96px] w-[96px] rounded-full bg-[#7044c9]" />

      <div className="relative z-10 mx-auto max-w-[900px]">
        <h2 className="text-[28px] font-bold leading-[1.1] text-white md:text-[32px]">
          Nuestro Impacto
        </h2>
        <p className="mt-3 text-lg leading-[1.35] text-[#d2c9e5] md:text-2xl">
          Cada número representa una vida transformada, una familia con mejores
          oportunidades y una comunidad más fuerte y resiliente.
        </p>

        <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
          {impactStats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article key={stat.label} className="flex flex-col items-center">
                <span
                  className={`flex h-16 w-16 items-center justify-center rounded-full ${stat.bg} text-[#3a2467]`}
                >
                  <Icon size={30} strokeWidth={1.8} />
                </span>
                <strong className="mt-3 text-4xl font-bold leading-none text-[#d2c9e5]">
                  {stat.value}
                </strong>
                <span className="mt-3 text-sm leading-[1.15] text-white">
                  {stat.label}
                </span>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function AboutPage() {
  return (
    <div className="overflow-hidden bg-white text-[#211734]">
      <PublicHeader active="Sobre nosotros" />
      <main>
        <HeroAbout />
        <WhoWeAre />
        <ValuesSection />
        <MissionVision />
        <ImpactSection />
      </main>
      <PublicFooter />
    </div>
  );
}

