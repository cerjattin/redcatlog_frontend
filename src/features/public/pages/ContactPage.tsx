import { ChevronDown, Clock, Mail, Phone, Send } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { PublicFooter, PublicHeader } from "@/features/public/components/PublicLayout";

const contactDetails = [
  {
    title: "Email",
    value: "info@mujeresemprendedoras.co",
    icon: Mail,
  },
  {
    title: "Teléfono",
    value: "+57 300 123 4567",
    icon: Phone,
  },
] as const;

const schedules = [
  ["Lunes a Viernes", "9am - 6pm"],
  ["Sábados", "10am - 2pm"],
  ["Domingo", "Cerrado"],
] as const;

function ContactInfo() {
  return (
    <aside className="w-full max-w-[320px] lg:pt-24">
      <h2 className="text-center text-2xl font-semibold leading-tight text-[#211734] lg:text-left">
        Información de contacto
      </h2>

      <div className="mt-8 space-y-8">
        {contactDetails.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.title} className="flex items-center gap-6">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#ff88ac]/10 text-[#d94673]">
                <Icon size={32} strokeWidth={1.8} />
              </span>
              <div>
                <h3 className="text-xl font-semibold leading-none text-[#211734]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm text-[#6d6383]">{item.value}</p>
              </div>
            </div>
          );
        })}

        <div className="flex items-start gap-6">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#ff88ac]/10 text-[#d94673]">
            <Clock size={32} strokeWidth={1.8} />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-semibold leading-none text-[#211734]">
              Horarios de atención
            </h3>
            <dl className="mt-3 space-y-1 text-sm text-[#6d6383]">
              {schedules.map(([day, time]) => (
                <div key={day} className="grid grid-cols-[1fr_auto] gap-6">
                  <dt className="font-semibold">{day}</dt>
                  <dd>{time}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </aside>
  );
}

function ContactForm() {
  const inputClass =
    "h-12 rounded-lg border-[#dcdcee] bg-[#f8f8fc] px-4 text-sm text-[#211734] placeholder:text-[#8e8eaa] focus:border-[#d66eff] focus:ring-[#d66eff]/20";
  const labelClass = "[&>span]:font-medium [&>span]:text-[#3c3c55]";

  return (
    <section className="w-full max-w-[618px] rounded-[24px] bg-white p-6 shadow-[0_0_24px_rgba(33,23,52,0.05)] md:p-8">
      <h2 className="text-center text-2xl font-semibold leading-tight text-[#211734]">
        Envíanos un mensaje
      </h2>

      <form
        className="mt-6 space-y-6"
        onSubmit={(event) => event.preventDefault()}
      >
        <Input
          label="Nombre completo"
          name="fullName"
          placeholder="Ingresa tu nombre"
          className={inputClass}
          wrapperClassName={labelClass}
        />

        <Input
          label="Correo electrónico"
          name="email"
          type="email"
          placeholder="Ingresa tu correo electrónico"
          className={inputClass}
          wrapperClassName={labelClass}
        />

        <div className="grid gap-4 sm:grid-cols-[112px_1fr]">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#3c3c55]">
              Teléfono
            </span>
            <span className="flex h-12 items-center gap-2 rounded-lg border border-[#dcdcee] bg-[#f8f8fc] px-4 text-sm text-[#8e8eaa]">
              <span
                aria-label="Colombia"
                className="inline-flex h-4 w-6 flex-col overflow-hidden rounded-[2px] border border-black/10"
              >
                <span className="block w-full flex-[2] bg-[#fcd116]" />
                <span className="block w-full flex-1 bg-[#003893]" />
                <span className="block w-full flex-1 bg-[#ce1126]" />
              </span>
              +57 <ChevronDown className="ml-auto" size={18} />
            </span>
          </label>
          <Input
            name="phone"
            type="tel"
            placeholder="Ingresa el número de teléfono"
            className={`${inputClass} sm:mt-[26px]`}
          />
        </div>

        <Textarea
          label="Mensaje"
          name="message"
          placeholder="Escribe tu mensaje aquí..."
          className={`${inputClass} min-h-12 resize-none py-4`}
          wrapperClassName={labelClass}
        />

        <Button
          type="submit"
          className="relative h-[52px] w-full rounded-full bg-[#211734] text-lg font-bold text-white shadow-[0_12px_12px_rgba(55,19,129,0.1)] hover:bg-[#3a2467]"
        >
          <span className="flex-1 text-center">Enviar</span>
          <Send className="absolute right-6" size={24} strokeWidth={1.8} />
        </Button>
      </form>
    </section>
  );
}

function DecorativeShapes() {
  return (
    <>
      <div className="pointer-events-none absolute bottom-[-130px] left-[-150px] h-[360px] w-[360px] rounded-full border-[34px] border-[#ffd8cc]" />
      <div className="pointer-events-none absolute bottom-[-58px] left-[-20px] h-[180px] w-[180px] rounded-full border-[34px] border-[#ffd8cc]" />
      <div className="pointer-events-none absolute bottom-0 right-0 hidden items-end gap-3 md:flex">
        <span className="h-[98px] w-[98px] rounded-full bg-[#d9b7d5]" />
        <span className="h-[98px] w-[98px] bg-[#d9b7d5] [clip-path:polygon(0_0,100%_100%,0_100%)]" />
      </div>
    </>
  );
}

function ContactContent() {
  return (
    <main className="relative isolate overflow-hidden bg-[linear-gradient(159deg,#ffe9f0_14%,#ffffff_48%,#ffe8df_109%)] pb-20">
      <DecorativeShapes />

      <section className="relative z-10 mx-auto flex max-w-[1224px] flex-col items-center gap-8 px-5 pt-12 md:flex-row md:justify-center md:gap-12 md:pt-24 lg:pt-[136px]">
        <img
          src="/contact/icon-header-contact.png"
          alt=""
          className="h-auto w-[180px] md:w-[239px]"
        />
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-semibold leading-[1.1] text-[#211734] md:text-[52px]">
            Contáctanos
          </h1>
          <p className="mt-4 max-w-[617px] text-xl leading-[1.35] text-[#6d6383] md:text-2xl">
            ¿Tienes preguntas o quieres saber más? Estamos aquí para ayudarte
          </p>
        </div>
      </section>

      <section className="relative z-10 mx-auto mt-12 flex max-w-[1224px] flex-col items-center justify-center gap-12 px-5 lg:flex-row lg:gap-[120px]">
        <ContactInfo />
        <ContactForm />
      </section>
    </main>
  );
}

export function ContactPage() {
  return (
    <div className="overflow-hidden bg-white text-[#211734]">
      <PublicHeader active="Contacto" />
      <ContactContent />
      <PublicFooter />
    </div>
  );
}

