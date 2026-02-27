import Link from "next/link";
import { Coins, Instagram, Twitter, Youtube } from "lucide-react";
import { cn } from "@/lib/utils";

const platformLinks = [
  { label: "Para Atletas", href: "/athletes" },
  { label: "Para Organizadores", href: "/organizers" },
  { label: "Para Marcas", href: "/brands" },
  { label: "Para Fãs", href: "/fans" },
  { label: "Para Apostadores", href: "/bettors" },
  { label: "Para Árbitros", href: "/referees" },
];

const resourceLinks = [
  { label: "Blog", href: "/blog" },
  { label: "GCoins", href: "/gcoins" },
  { label: "Torneios", href: "/tournaments" },
  { label: "Ranking", href: "/ranking" },
  { label: "Loja", href: "/store" },
];

const companyLinks = [
  { label: "Sobre", href: "/about" },
  { label: "Contato", href: "/contact" },
  { label: "Termos", href: "/terms" },
  { label: "Privacidade", href: "/privacy" },
  { label: "FAQ", href: "/faq" },
];

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com/sportio", icon: Instagram },
  { label: "Twitter", href: "https://twitter.com/sportio", icon: Twitter },
  { label: "Youtube", href: "https://youtube.com/sportio", icon: Youtube },
];

function FooterLinkGroup({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
        {title}
      </h3>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={cn(
                "text-sm text-gray-400 transition-colors hover:text-white"
              )}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white">
                <Coins className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-white">Sportio</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              A plataforma completa que conecta atletas, organizadores, marcas,
              fãs e apostadores no mundo do esporte. Transformando o esporte com
              tecnologia e GCoins.
            </p>
            <div className="mt-6 flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg",
                    "bg-gray-800 text-gray-400 transition-colors",
                    "hover:bg-emerald-500 hover:text-white"
                  )}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform links */}
          <FooterLinkGroup title="Plataforma" links={platformLinks} />

          {/* Resource links */}
          <FooterLinkGroup title="Recursos" links={resourceLinks} />

          {/* Company links */}
          <FooterLinkGroup title="Empresa" links={companyLinks} />
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 sm:flex-row">
          <p className="text-sm text-gray-400">
            &copy; 2025 Sportio. Todos os direitos reservados.
          </p>
          <p className="flex items-center gap-1.5 text-sm text-gray-400">
            A moeda digital do esporte:
            <span className="font-semibold text-emerald-400">GCoins</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
