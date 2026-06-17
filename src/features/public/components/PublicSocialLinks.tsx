import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa6";

import { cn } from "@/utils/cn";

type SocialNetwork = {
  key: "facebook" | "instagram" | "tiktok";
  label: string;
  url?: string | null;
  icon: typeof FaFacebookF;
};

type PublicSocialLinksProps = {
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  tiktokUrl?: string | null;
  className?: string;
  itemClassName?: string;
  showLabels?: boolean;
};

function getSafeUrl(url?: string | null) {
  const value = url?.trim();

  return value && value.length > 0 ? value : null;
}

export function PublicSocialLinks({
  facebookUrl,
  instagramUrl,
  tiktokUrl,
  className,
  itemClassName,
  showLabels = false,
}: PublicSocialLinksProps) {
  const networks: SocialNetwork[] = [
    {
      key: "facebook",
      label: "Facebook",
      url: facebookUrl,
      icon: FaFacebookF,
    },
    {
      key: "instagram",
      label: "Instagram",
      url: instagramUrl,
      icon: FaInstagram,
    },
    {
      key: "tiktok",
      label: "TikTok",
      url: tiktokUrl,
      icon: FaTiktok,
    },
  ];

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {networks.map((network) => {
        const Icon = network.icon;
        const safeUrl = getSafeUrl(network.url);
        const content = (
          <>
            <Icon className="h-4 w-4" aria-hidden="true" />
            {showLabels ? <span>{network.label}</span> : null}
          </>
        );
        const sharedClassName = cn(
          "inline-flex h-10 min-w-10 items-center justify-center gap-2 rounded-full border border-[#cfc5df] bg-white/80 px-3 text-sm font-semibold text-[#7044c9] transition",
          safeUrl
            ? "hover:border-[#d66eff] hover:bg-[#f7edff] hover:text-[#3a2467]"
            : "cursor-default opacity-60",
          itemClassName,
        );

        if (!safeUrl) {
          return (
            <span
              key={network.key}
              className={sharedClassName}
              aria-label={`${network.label} no disponible`}
              title={`${network.label} no disponible`}
            >
              {content}
            </span>
          );
        }

        return (
          <a
            key={network.key}
            href={safeUrl}
            target="_blank"
            rel="noreferrer"
            className={sharedClassName}
            aria-label={network.label}
            title={network.label}
          >
            {content}
          </a>
        );
      })}
    </div>
  );
}
